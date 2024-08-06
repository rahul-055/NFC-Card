const express = require('express');
const Router = express.Router();
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const DB = require('../../models/db');
const db = require('../../models/schemaconnection');
const UPLOAD = require('../../models/fileupload');
const verifyToken = require('../../models/verifyToken');
const { Capitalize } = require('../../models/helperfunctions');
var ObjectId = require('mongodb').ObjectId;


const project = {
    createdAt: 0,
    updatedAt: 0,
}
var cpUpload = UPLOAD.fields([{ name: 'logo', maxCount: 50 }])
Router.post('/addApp', verifyToken, cpUpload, async function (req, res) {

    let typesArr = []
    let appname = JSON.parse(req.body.appname)
    let inputtype = JSON.parse(req.body.inputtype)
    if (appname.length > 0) {
        for (let i = 0; i < appname.length; i++) {
            typesArr.push(
                {
                    logo: req.files['logo'][i] ? req.files['logo'][i].path : "",
                    appname: Capitalize(appname[i]),
                    inputtype: inputtype[i],
                }
            )
        }
    }
    const alreadyExist = await db.apps.findOne({ sortorder: Number(req.body.sortorder) });
    if (alreadyExist) {
        res.statusMessage = "This sort order already exist";
        return res.status(409).end();
    }
    const resultExists = await db.apps.findOne({ name: Capitalize(req.body.name) });
    if (resultExists) {
        for (let i = 0; i < typesArr.length; i++) {
            const formData = {
                parentid: resultExists._id,
                name: req.body.name ? Capitalize(req.body.name) : '',
                appname: typesArr[i].appname ? helperFunction.Capitalize(typesArr[i].appname) : '',
                logo: typesArr[i].logo ? typesArr[i].logo : '',
                inputtype: typesArr[i].inputtype ? typesArr[i].inputtype : '',
                status: 1,
                isDeleted: 0,
            }
            DB.InsertDocument('apps', formData, function (err, result) {
                if (err) {
                    res.status(400).end();
                }
            });
        }
        res.statusMessage = "App created successfully";
        return res.status(201).end();
    } else {
        const formData = {
            name: req.body.name ? Capitalize(req.body.name) : '',
            sortorder: req.body.sortorder ? Number(req.body.sortorder) : '',
            isDeleted: 0,
            status: 1,
        }
        DB.InsertDocument('apps', formData, function (err, result) {
            if (err) {
                res.status(400).end();
            } else {
                if (result) {
                    const formData = {
                        parentid: result._id,
                    }
                    DB.FindUpdateDocument('apps', { _id: result._id }, formData, function (err, result2) {
                        if (err) {
                            res.status(400).end();
                        }
                    });
                    for (let i = 0; i < typesArr.length; i++) {
                        const formData = {
                            parentid: result._id,
                            name: req.body.name ? Capitalize(req.body.name) : '',
                            appname: typesArr[i].appname ? helperFunction.Capitalize(typesArr[i].appname) : '',
                            logo: typesArr[i].logo ? typesArr[i].logo : '',
                            inputtype: typesArr[i].inputtype ? typesArr[i].inputtype : '',
                            status: 1,
                            isDeleted: 0,
                        }
                        DB.InsertDocument('apps', formData, function (err, result) {
                            if (err) {
                                res.status(400).end();
                            }
                        });
                    }
                    res.statusMessage = "App created successfully";
                    return res.status(201).end();
                }
            }
        });
    }

});

Router.get('/listApp', verifyToken, function (req, res) {
    let query = {};
    DB.GetDocument('apps', query, {}, { sort: { createdAt: -1 } }, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {

            var tempRes = []
            if (result && result.length > 0) {
                result.map((item) => {
                    let enterStatus = false
                    let appArr = []
                    let appObject = []
                    let name = ''
                    result.map((item1) => {
                        if (item._id == (item1.parentid)) {
                            if (item1.appname) {
                                name = item1.name
                                appArr.push(item1.appname)
                                appObject.push({
                                    id: item1._id,
                                    logo: item1.logo,
                                    appname: item1.appname,
                                    inputtype: item1.inputtype,
                                })
                                enterStatus = true
                            }
                        }
                    })
                    if (enterStatus) {
                        let obj = {}
                        obj['_id'] = item._id ? item._id : ''
                        obj['name'] = name
                        obj['sortorder'] = item.sortorder
                        obj['types'] = appArr.join(", ")
                        obj['typesList'] = appObject
                        obj['status'] = item.status ? item.status : item.status;
                        tempRes.push(obj)
                    }
                })
            }
            return res.status(200).json(tempRes);
        }
    });
});

Router.get('/viewApp/:id', verifyToken, function (req, res) {
    DB.GetDocument('apps', { parentid: req.params.id }, {}, {}, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            let obj = {}
            if (result.length > 0) {
                result.map((item) => {
                    let enterStatus = false
                    let appObject = []
                    let name = ''
                    result.map((item1) => {
                        if (item._id == (item1.parentid)) {
                            if (item1.appname) {
                                name = item1.name
                                appObject.push({
                                    id: item1._id,
                                    logo: item1.logo,
                                    appname: item1.appname,
                                    inputtype: item1.inputtype,
                                })
                                enterStatus = true
                            }
                        }
                    })
                    if (enterStatus) {
                        obj['_id'] = item._id ? item._id : ''
                        obj['sortorder'] = item.sortorder
                        obj['name'] = name
                        obj['types'] = appObject
                        obj['status'] = item.status ? item.status : item.status;
                    }
                })
            }
            return res.status(200).json(obj);
        }
    });
});

Router.post('/updateApp/:id', verifyToken, cpUpload, async function (req, res) {
    let appname = JSON.parse(req.body.appname)
    let inputtype = JSON.parse(req.body.inputtype)
    let sortorder = JSON.parse(req.body.sortorder)
    let arrId = JSON.parse(req.body.id)
    let existArray = JSON.parse(req.body.existsArr).length > 0 ? JSON.parse(req.body.existsArr) : []
    if (appname.length > 0) {
        for (let i = 0; i < appname.length; i++) {
            existArray.push(
                {
                    logo: req.files['logo'][i] ? req.files['logo'][i].path : '',
                    appname: Capitalize(appname[i]),
                    inputtype: inputtype[i],
                    id: arrId[i],
                }
            )
        }
    }
    const alreadyExist = await db.apps.findOne({ sortorder: Number(req.body.sortorder) });
    if (alreadyExist != null) {
        if (alreadyExist._id != req.params.id) {
            res.statusMessage = "This sort order already exist";
            return res.status(409).end();
        }
    }
    DB.GetDocument('apps', { parentid: req.params.id }, {}, {}, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            if (result) {
                if (existArray.length > 0) {
                    result.map((item) => {
                        if (item.appname) {
                            let status = ''
                            let value = {}
                            existArray.map((e) => {
                                if (e.id != null) {
                                    if (e.id == item._id) {
                                        status = "Update"
                                        value = e
                                    }
                                }
                            })
                            if (status == "Update") {
                                let formData = {
                                    parentid: req.params.id,
                                    name: req.body.name ? Capitalize(req.body.name) : '',
                                    appname: value.appname ? helperFunction.Capitalize(value.appname) : '',
                                    inputtype: value.inputtype ? value.inputtype : '',
                                    logo: value.logo ? value.logo : '',
                                }
                                DB.FindUpdateDocument('apps', { _id: value.id }, formData, function (err, result) {
                                    if (err) {
                                        res.status(400).end();
                                    }
                                });
                            }
                        }
                    })
                    if (existArray.length > 0) {
                        existArray.map((item) => {
                            let status = result.find(e => e._id == item.id)
                            if (!status) {
                                let formData = {
                                    parentid: req.params.id,
                                    name: req.body.name ? Capitalize(req.body.name) : '',
                                    appname: item.appname ? helperFunction.Capitalize(item.appname) : '',
                                    inputtype: item.inputtype ? item.inputtype : '',
                                    logo: item.logo ? item.logo : '',
                                    status: 1,
                                    isDeleted: 0,
                                }
                                DB.InsertDocument('apps', formData, function (err, result) {
                                    if (err) {
                                        res.status(400).end();
                                    }
                                });
                            }
                        })
                    }
                    const deleteVal = result.filter(({ _id: id1 }) => !existArray.some(({ id: id2 }) => id2 == id1));
                    if (deleteVal.length > 0) {
                        deleteVal.map((item) => {
                            if (item._id != req.params.id) {
                                DB.DeleteDocument('apps', { _id: item._id }, function (err, result3) {
                                    if (err) {
                                        res.status(400).end();
                                    }
                                });
                            }
                        })
                    }
                }
                DB.UpdateManyDocument('apps', { parentid: req.params.id }, { name: req.body.name ? Capitalize(req.body.name) : '', }, function (err, result1) {
                    if (err) {
                        res.status(400).end();
                    }
                });
                DB.FindUpdateDocument('apps', { _id: req.params.id }, { sortorder: req.body.sortorder ? Number(req.body.sortorder) : '', }, function (err, result) {
                    if (err) {
                        res.status(400).end();
                    }
                });
                return res.status(200).end();
            }

        }
    })
});

Router.get('/softDeleteApp/:id', verifyToken, async function (req, res) {
    const results = await db.rooms.findOne({ "room.colorcode": req.params.id });
    if (results) {
        res.statusMessage = "If you can't delete this field, because,this is currently connected with another management!";
        return res.status(409).end();
    }
    DB.GetOneDocument('apps', { _id: req.params.id }, {}, {}, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            DB.FindUpdateDocument('apps', { _id: req.params.id }, { isDeleted: result.isDeleted ? !result.isDeleted : 1 }, function (err, result1) {
                if (err) {
                    res.status(400).end();
                } else {
                    res.status(200).end();
                }
            })
        }
    })
})

Router.get('/deleteApp/:id', async function (req, res) {
    DB.DeleteDocument('apps', { parentid: req.params.id }, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            return res.status(200).json(result);
        }
    });
})

module.exports = Router;
