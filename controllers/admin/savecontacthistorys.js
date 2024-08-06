const express = require('express');
const Router = express.Router();
const DB = require('../../models/db');
const verifyToken = require('../../models/verifyToken');

const project = {
    createdAt: 0,
    updatedAt: 0,
    password: 0,
}

Router.get('/getSaveContactHistory', verifyToken, function (req, res) {
    DB.GetDocument('savecontacthistories', {}, {}, { populate: 'user saver', sort: { time: -1 } }, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            const tempRes = []
            let repeatedArr = []
            if (result && result.length > 0) {
                result.map((item, i) => {
                    if (item.user) {
                        let status = repeatedArr.includes(item.user._id)
                        repeatedArr.push(item.user._id)
                        if (!status) {
                            let count = 0
                            result.map((item1) => {
                                if ((item.user._id).equals(item1.user._id)) {
                                    count += 1
                                }
                            })
                            let obj = {};
                            obj['_id'] = item._id ? item.user._id : ''
                            obj['username'] = item.user ? item.user.username : ''
                            obj['email'] = item.user ? item.user.email : ''
                            obj['displayname'] = item.user ? item.user.displayname : ''
                            obj['saverusername'] = item.saver ? item.saver.username : ''
                            obj['saveremail'] = item.saver ? item.saver.email : ''
                            obj['saverdisplayname'] = item.saver ? item.saver.displayname : ''
                            obj['time'] = item.time ? item.time : '';
                            obj['ip'] = item.ip ? item.ip : '';
                            obj['device'] = item.device ? item.device : '';
                            obj['addresss'] = item.city ? item.city + ", " + ", " + item.country : '';
                            obj['city'] = item.city ? item.city : '';
                            obj['country'] = item.country ? item.country : '';
                            obj['count'] = count ? count : 0;
                            obj['status'] = item.status ? item.status : 0;
                            tempRes.push(obj)
                        }
                    }
                });
            }
            return res.status(200).json(tempRes);
        }
    });

});


Router.get('/ViewSaveContactHistory/:id', verifyToken, function (req, res) {
    DB.GetDocument('savecontacthistories', { user: req.params.id }, {}, { populate: 'user saver', sort: { time: -1 } }, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            const tempRes = {}
            let repeatedArr = []
            if (result && result.length > 0) {
                result.map((item, i) => {
                    let status = repeatedArr.includes(item.user._id)
                    repeatedArr.push(item.user._id)
                    if (!status) {
                        let saverHistory = []
                        result.map((item1) => {
                            let obj = {};
                            obj['displayname'] = item1.user ? item1.user.displayname : ''
                            obj['saverusername'] = item1.saver ? item1.saver.username : ''
                            obj['saveremail'] = item1.saver ? item1.saver.email : ''
                            obj['saverimage'] = item1.saver ? item1.saver.image : ''
                            obj['saverdisplayname'] = item1.saver ? item1.saver.displayname : ''
                            obj['time'] = item1.time ? item1.time : '';
                            obj['ip'] = item1.ip ? item1.ip : '';
                            obj['device'] = item1.device ? item1.device : '';
                            obj['addresss'] = item1.city ? item1.city + ", " + item1.country : '';
                            obj['city'] = item1.city ? item1.city : '';
                            obj['country'] = item1.country ? item1.country : '';
                            saverHistory.push(obj)
                        })
                        tempRes['_id'] = item._id ? item.user._id : ''
                        tempRes['username'] = item.user ? item.user.username : ''
                        tempRes['email'] = item.user ? item.user.email : ''
                        tempRes['displayname'] = item.user ? item.user.displayname : ''
                        tempRes['image'] = item.user ? item.user.image : ''
                        tempRes['saverHistory'] = saverHistory.length > 0 ? saverHistory : []
                        tempRes['count'] = result.length
                    }
                });
            }
            return res.status(200).json(tempRes);
        }
    });
});

Router.get('/deleteSaveContact/:id', async function (req, res) {
    DB.DeleteDocument('savecontacthistories', { _id: req.params.id }, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            return res.status(200).json(result);
        }
    });
})

Router.get('/deleteSaveContactByUserId/:id', async function (req, res) {
    DB.DeleteDocument('savecontacthistories', { user: req.params.id }, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            return res.status(200).json(result);
        }
    });
})

module.exports = Router;