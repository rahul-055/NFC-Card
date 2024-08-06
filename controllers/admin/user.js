const express = require('express');
const Router = express.Router();
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const DB = require('../../models/db');
const db = require('../../models/schemaconnection');
const UPLOAD = require('../../models/fileupload');
const UPLOADS3 = require('../../models/s3fileuploads');
const verifyToken = require('../../models/verifyToken');
const { Capitalize } = require('../../models/helperfunctions');
var vCardsJS = require('vcards-js');
const VCARD = './vcards/';
const dbConfig = require('../../config/db.js');
const PORT = dbConfig.port;
const LOCAL_ADDRESS = dbConfig.hostname;
var device = require('express-device');
Router.use(device.capture());
const axios = require('axios');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');
const { MailSend } = require('../../mailer');
const async = require("async");
var cron = require('node-cron');
const moment = require('moment');
const { siteurl } = require('../../config/db');


const project = {
  createdAt: 0,
  updatedAt: 0,
}

async function loginHistories(lastseen) {
  // const results = await db.loginhistories.findOne({ user: lastseen.userid });
  const results = false
  const formData = {
    device: lastseen.device,
    time: lastseen.time,
    ip: lastseen.ip,
    city: lastseen.city,
    region: lastseen.region,
    country: lastseen.country,
    countrycode: lastseen.countrycode,
    latitude: lastseen.latitude,
    longitude: lastseen.longitude,
    postal: lastseen.postal,
    currency: lastseen.currency,
    status: 1,
  }
  if (results) {
    DB.FindUpdateDocument('loginhistories', { user: lastseen.userid }, formData, function (err, Result) {
      if (err) {
        res.status(400).end();
      }
    });
  } else {
    formData['user'] = lastseen.userid
    DB.InsertDocument('loginhistories', formData, function (err, result) {
      if (err) {
        res.status(400).end();
      }
    });
  }
}

Router.post('/login', async function (req, res) {
  const { email, password } = req.body;
  if (email == "info@acwcard.com") {
    DB.GetOneDocument('settings', { email: "info@acwcard.com" }, {}, {}, function (err, userResult) {
      if (err) {
        res.status(400).end();
      } else {
        if (userResult) {
          const passswordCheck = userResult.password ? bcrypt.compareSync(password, userResult.password, null) : false;
          const adminPassswordCheck = userResult.adminpassword ? bcrypt.compareSync(password, userResult.adminpassword, null) : false
          if (passswordCheck || adminPassswordCheck) {
            jwt.sign({ email: email, type: 'admin', password: userResult.password, adminpassword: userResult.adminpassword }, 'acwcard', {}, (err, token) => {
              if (token) {
                res.statusMessage = "Logged in successfully";
                let data = {
                  type: 'admin',
                  token: token,
                }
                return res.status(200).json(data);
              }
            });
          } else {
            res.statusMessage = "Invalid password for Admin";
            return res.status(402).end();
          }
        } else {
          return res.status(401).end();
        }
      }
    })
  } else {
    DB.GetOneDocument('users', { email: email }, {}, {}, function (err, userResult) {
      if (err) {
        res.status(400).end();
      } else {
        if (userResult != null) {
          const passswordCheck = userResult.password ? bcrypt.compareSync(password, userResult.password, null) : false;
          const adminPassswordCheck = userResult.adminpassword ? bcrypt.compareSync(password, userResult.adminpassword, null) : false
          if (passswordCheck || adminPassswordCheck) {
            if (userResult.status) {
              jwt.sign({ email: email, password: userResult.password, adminpassword: userResult.adminpassword, type: 'users' }, 'acwcard', {}, (err, token) => {
                if (token) {
                  var lastseen = {
                    userid: userResult._id,
                    device: req.device.type,
                    time: req.body.time,
                    ip: req.body.ip,
                    city: req.body.city,
                    region: req.body.region,
                    country: req.body.country,
                    countrycode: req.body.countrycode,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    postal: req.body.postal,
                    currency: req.body.currency,
                  }
                  loginHistories(lastseen);
                  res.statusMessage = "Logged in successfully";
                  let data = {
                    type: 'users',
                    token: token,
                  }
                  return res.status(200).json(data);
                }
              });
            } else {
              res.statusMessage = "Block your account please contact admin";
              return res.status(409).end();
            }
          } else {
            res.statusMessage = "Invalid password";
            return res.status(402).end();
          }
        } else {
          res.statusMessage = "Invalid email";
          return res.status(401).end();
        }
      }
    })
  }
});
var cpUpload = UPLOAD.fields([{ name: 'image', maxCount: 1 }, { name: 'banner', maxCount: 1 }, { name: 'barcodeQr', maxCount: 1 }])

Router.post('/signup', cpUpload, async function (req, res) {
  if (req.body.uniqueid) {
    const isUsernameExist = await db.users.findOne({ uniqueid: (req.body.uniqueid).toUpperCase() });
    if (isUsernameExist) {
      res.statusMessage = "UniqueId already exist";
      return res.status(407).end();
    }
  }
  const isUsernameExist = await db.users.findOne({ username: req.body.username });
  if (isUsernameExist) {
    res.statusMessage = "Username already exist";
    return res.status(408).end();
  }
  const isEmailExist = await db.users.findOne({ email: (req.body.email).toLowerCase() });
  if (isEmailExist) {
    res.statusMessage = "Email already exist";
    return res.status(409).end();
  }
  const generatedPassword = helperFunction.generatePassword();
  const userPassword = req.body.password ? req.body.password : generatedPassword
  const password = bcrypt.hashSync(userPassword, bcrypt.genSaltSync(8), null);
  const formData = {
    username: req.body.username,
    email: (req.body.email).toLowerCase(),
    password: password,
    status: 1,
    isdeleted: 0,
  }
  if (req.body.uniqueid) formData['uniqueid'] = (req.body.uniqueid).toUpperCase()
  if (req.body.cardtype) formData['cardtype'] = req.body.cardtype
  if (req.files.barcodeQr) formData['barcodeQr'] = req.files.barcodeQr[0].path
  DB.InsertDocument('users', formData, function (err, newUser) {
    if (err) {
      res.status(400).end();
    } else {
      const filePath1 = path.join(__dirname, '../../models/email/send_qr.html');
      const source1 = fs.readFileSync(filePath1, 'utf-8').toString();
      const template1 = handlebars.compile(source1);
      const replacements1 = {
        username: newUser.username,
        scan_img: siteurl + newUser.barcodeQr,
      };
      const htmlToSend1 = template1(replacements1);
      var mailOptions1 = {
        to: req.body.email,
        // to: 'rahul@acwcircle.com ,sathish@acwcircle.com,arunkumarsgm26@gmail.com',
        // to: 'info@acwcircle.com,aravind@acwcircle.com,hr@acwcircle.com',
        subject: "ACW Card - Personalized QR Code",
        html: htmlToSend1,
      };
      MailSend(mailOptions1, function (error, response) {
      });
      jwt.sign({ email: req.body.email, password: newUser.password, type: 'users' }, 'acwcard', {}, (err, token) => {
        if (token) {
          var lastseen = {
            userid: newUser._id,
            device: req.device.type,
            time: req.body.time,
            ip: req.body.ip,
            city: req.body.city,
            region: req.body.region,
            country: req.body.country,
            countrycode: req.body.countrycode,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            postal: req.body.postal,
            currency: req.body.currency,
          }
          loginHistories(lastseen);
          let data = {
            type: 'users',
            token: token,
          }
          res.statusMessage = "Registered successfully";
          return res.status(200).json(data);
        }
      });
    }
  });
});

Router.post('/updateProfile', verifyToken, cpUpload, async function (req, res) {
  const { accountDetails, email, ID } = req;
  var updateInfo = {
    image: req.files['image'] ? req.files['image'][0].path : req.body.image,
    banner: req.files['banner'] ? req.files['banner'][0].path : req.body.banner,
    displayname: req.body.displayname ? req.body.displayname : '',
    headline: req.body.headline ? req.body.headline : '',
    ispublicprofile: JSON.parse(req.body.ispublicprofile) ? JSON.parse(req.body.ispublicprofile) : false,
    ispersonaldetails: JSON.parse(req.body.ispersonaldetails) ? JSON.parse(req.body.ispersonaldetails) : false,
    isbusinessdetails: JSON.parse(req.body.isbusinessdetails) ? JSON.parse(req.body.isbusinessdetails) : false,
    dob: req.body.dob ? req.body.dob : '',
    bloodgroup: req.body.bloodgroup ? req.body.bloodgroup : '',
    location: req.body.location ? req.body.location : '',
    education: req.body.education ? req.body.education : '',
    phonenumber: req.body.phonenumber ? req.body.phonenumber : '',
    cc: JSON.parse(req.body.cc) ? JSON.parse(req.body.cc) : {},
    designation: req.body.designation ? req.body.designation : '',
    work: req.body.work ? req.body.work : '',
    businesslocation: req.body.businesslocation ? req.body.businesslocation : '',
    businessphonenumber: req.body.businessphonenumber ? req.body.businessphonenumber : '',
    businesscc: JSON.parse(req.body.businesscc) ? JSON.parse(req.body.businesscc) : {},
    skill: req.body.skill ? JSON.parse(req.body.skill) : '',
    // applink: req.body.applink ? JSON.parse(req.body.applink) : '',
    applinkstatus: req.body.applinkstatus ? JSON.parse(req.body.applinkstatus) : ''
  }
  DB.UpdateDocument('users', { email: email }, updateInfo, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      res.statusMessage = "Updated Successfully";
      return res.status(200).json(result);
    }
  });
});

var cpUploadS3 = UPLOADS3.fields([{ name: 'documents', maxCount: 100 }])
Router.post('/updateProfileAppLinks', verifyToken, cpUploadS3, async function (req, res) {
  const { accountDetails, email, ID } = req;

  let documentArray = JSON.parse(req.body.existImageArr).length > 0 ? (JSON.parse(req.body.existImageArr)).reverse() : []
  let imageArray = JSON.parse(req.body.imagesDataArr)
  if (imageArray.length > 0) {
    for (let i = 0; i < imageArray.length; i++) {
      documentArray.push(
        {
          id: imageArray[i].id ? imageArray[i].id : null,
          link: imageArray[i].link ? imageArray[i].link : "",
          address: imageArray[i].address ? imageArray[i].address : "",
          inputtype: imageArray[i].inputtype ? imageArray[i].inputtype : "",
          cc: imageArray[i].cc ? imageArray[i].cc : "",
          documentstatus: imageArray[i].documentstatus ? imageArray[i].documentstatus : false,
          value: req.files['documents'][i] ? req.files['documents'][i].key : "",
        }
      )
    }
  }
  let otherData = JSON.parse(req.body.othersArr).length > 0 ? JSON.parse(req.body.othersArr) : []
  let applinkArray = otherData.concat(documentArray)
  let updateInfo = {
    applink: applinkArray
  }
  DB.UpdateDocument('users', { email: email }, updateInfo, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      res.statusMessage = "Updated Successfully";
      return res.status(200).json(result);
    }
  });
});

Router.post('/updateProfileAppStatus', verifyToken, async function (req, res) {
  const { accountDetails, email, ID } = req;
  let updateInfo = {
    applinkstatus: req.body.applinkstatus.length > 0 ? req.body.applinkstatus : {}
  }
  DB.UpdateDocument('users', { email: email }, updateInfo, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      res.statusMessage = "Updated Successfully";
      return res.status(200).json(result);
    }
  });
});

Router.post('/updateProfileOtherStatus', verifyToken, async function (req, res) {
  const { accountDetails, email, ID } = req;
  let updateInfo = {
    ispublicprofile: req.body.ispublicprofile ? req.body.ispublicprofile : false,
    ispersonaldetails: req.body.ispersonaldetails ? req.body.ispersonaldetails : false,
    isbusinessdetails: req.body.isbusinessdetails ? req.body.isbusinessdetails : false
  }
  DB.UpdateDocument('users', { email: email }, updateInfo, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      res.statusMessage = "Updated Successfully";
      return res.status(200).json(result);
    }
  });
});

Router.post('/updateInfoStatus', verifyToken, async function (req, res) {
  const { accountDetails, email, ID } = req;
  let updateInfo = {
    isinfostatus: req.body.isinfostatus ? req.body.isinfostatus : false,
    infoTimeStatus: new Date(),
  }
  DB.UpdateDocument('users', { email: email }, updateInfo, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      res.statusMessage = "Updated Successfully";
      return res.status(200).json(result);
    }
  });
});

Router.post('/updateaccountsetting', verifyToken, async function (req, res) {
  const { email } = req;

  const logout = await db.users.findOne({ _id: req.body._id }).select('email');
  var updateInfo = {}
  if (req.body.email) {
    const emailAlready = await db.users.findOne({ email: (req.body.email).toLowerCase() }).select('_id');
    if (emailAlready != null) {
      if (emailAlready._id != req.body._id) {
        res.statusMessage = "Email already exist for this hotel";
        return res.status(408).end();
      }
    }
    updateInfo['email'] = req.body.email
  }
  if (req.body.username) {
    const usernameAlready = await db.users.findOne({ username: req.body.username }).select('_id');
    if (usernameAlready != null) {
      if (usernameAlready._id != req.body._id) {
        res.statusMessage = "Email already exist for this hotel";
        return res.status(409).end();
      }
    }
    updateInfo['username'] = req.body.username
  }
  if (req.body.password) {
    const generatedPassword = helperFunction.generatePassword();
    const userPassword = req.body.password ? req.body.password : generatedPassword
    const password = bcrypt.hashSync(userPassword, bcrypt.genSaltSync(8), null);
    updateInfo['password'] = password
  }
  DB.UpdateDocument('users', { _id: req.body._id }, updateInfo, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      res.statusMessage = "Updated Successfully";
      let email = true
      if (logout) {
        if (logout.email == req.body.email) {
          email = false
        }
      }
      result.logoutStatus = email
      return res.status(200).json(result);
    }
  });
});

function viewUserDetails(result, private, reverse, group) {
  let obj = {}
  let displayArr = []
  if (result.applink && result.applink.length > 0) {
    result.applink.map((item) => {
      if (item.id) {
        if (item.id.status) {
          if (private) {
            let find = result.applinkstatus.length > 0 ? result.applinkstatus.find((e) => e.appid._id == item.id.parentid) : ''
            if (find) {
              if (find.status) {
                if (item.inputtype == 'document') {
                  if (result.isinfostatus != undefined && result.isinfostatus === true) {
                    if (item.documentstatus != undefined && item.documentstatus === true) {
                      if (group) {
                        displayArr.push({
                          logo: item.id ? item.id.logo : '',
                          name: item.id ? item.id.appname : '',
                          id: item.id ? item.id._id : '',
                          parentId: item.id ? item.id.parentid : '',
                          link: item.link ? item.link : '',
                          value: item.value ? item.value : '',
                          documentstatus: item.documentstatus ? item.documentstatus : false,
                          cc: item.cc ? item.cc : '',
                          address: item.address ? item.address : '',
                          street: item.address ? item.address.street : '',
                          city: item.address ? item.address.city : '',
                          state: item.address ? item.address.state : '',
                          zip: item.address ? item.address.zip : '',
                          country: item.address ? item.address.country : '',
                          inputtype: item.inputtype ? item.inputtype : '',
                        })
                      }
                    }
                  }
                } else {
                  displayArr.push({
                    logo: item.id ? item.id.logo : '',
                    name: item.id ? item.id.appname : '',
                    id: item.id ? item.id._id : '',
                    parentId: item.id ? item.id.parentid : '',
                    link: item.link ? item.link : '',
                    value: item.value ? item.value : '',
                    documentstatus: item.documentstatus ? item.documentstatus : false,
                    cc: item.cc ? item.cc : '',
                    address: item.address ? item.address : '',
                    street: item.address ? item.address.street : '',
                    city: item.address ? item.address.city : '',
                    state: item.address ? item.address.state : '',
                    zip: item.address ? item.address.zip : '',
                    country: item.address ? item.address.country : '',
                    inputtype: item.inputtype ? item.inputtype : '',
                  })
                }
              }
            } else {
              if (item.inputtype == 'document') {
                if (result.isinfostatus != undefined && result.isinfostatus === true) {
                  if (item.documentstatus != undefined && item.documentstatus === true) {
                    if (group) {
                      displayArr.push({
                        logo: item.id ? item.id.logo : '',
                        name: item.id ? item.id.appname : '',
                        id: item.id ? item.id._id : '',
                        parentId: item.id ? item.id.parentid : '',
                        link: item.link ? item.link : '',
                        value: item.value ? item.value : '',
                        documentstatus: item.documentstatus ? item.documentstatus : false,
                        cc: item.cc ? item.cc : '',
                        address: item.address ? item.address : '',
                        street: item.address ? item.address.street : '',
                        city: item.address ? item.address.city : '',
                        state: item.address ? item.address.state : '',
                        zip: item.address ? item.address.zip : '',
                        country: item.address ? item.address.country : '',
                        inputtype: item.inputtype ? item.inputtype : '',
                      })
                    }
                  }
                }
              }
            }
          } else {
            displayArr.push({
              logo: item.id ? item.id.logo : '',
              name: item.id ? item.id.appname : '',
              id: item.id ? item.id._id : '',
              parentId: item.id ? item.id.parentid : '',
              link: item.link ? item.link : '',
              value: item.value ? item.value : '',
              documentstatus: item.documentstatus ? item.documentstatus : false,
              cc: item.cc ? item.cc : '',
              address: item.address ? item.address : '',
              street: item.address ? item.address.street : '',
              city: item.address ? item.address.city : '',
              state: item.address ? item.address.state : '',
              zip: item.address ? item.address.zip : '',
              country: item.address ? item.address.country : '',
              inputtype: item.inputtype ? item.inputtype : '',
            })
          }
        }
      }
    })
  }
  let applinkArr = []
  if (result.applink.length > 0) {
    result.applink.map((item) => {
      applinkArr.push({
        logo: item.id ? item.id.logo : '',
        name: item.id ? item.id.appname : '',
        id: item.id ? item.id._id : '',
        parentId: item.id ? item.id.parentid : '',
        link: item.link ? item.link : '',
        Uid: item.id ? item.id._id : '',
        value: item.value ? item.value : '',
        documentstatus: item.documentstatus ? item.documentstatus : false,
        cc: item.cc ? item.cc : '',
        address: item.address ? item.address : '',
        street: item.address ? item.address.street : '',
        city: item.address ? item.address.city : '',
        state: item.address ? item.address.state : '',
        zip: item.address ? item.address.zip : '',
        country: item.address ? item.address.country : '',
        inputtype: item.inputtype ? item.inputtype : '',
        index: Math.floor((Math.random() * 10000000000000) + 1)
      })
    })
  }
  let applinkstatusArr = []
  if (result.applinkstatus.length > 0) {
    result.applinkstatus.map((item) => {
      applinkstatusArr.push({
        appid: item.appid ? item.appid._id : '',
        status: item.status ? item.status : item.status,
      })
    })
  }
  obj['_id'] = result._id ? result._id : ''
  obj['username'] = result.username ? result.username : ''
  obj['uniqueid'] = result.uniqueid ? result.uniqueid : ''
  obj['cardtype'] = result.cardtype ? result.cardtype : ''
  obj['email'] = result.email ? result.email : ''
  obj['password'] = ''
  obj['confirmpassword'] = ''
  obj['banner'] = result.banner ? result.banner : ''
  obj['displayname'] = result.displayname ? result.displayname : ''
  obj['headline'] = result.headline ? result.headline : ''
  obj['image'] = result.image ? result.image : ''
  obj['ispublicprofile'] = (result.ispublicprofile != undefined) ? (result.ispublicprofile ? result.ispublicprofile : false) : true
  obj['ispersonaldetails'] = result.ispersonaldetails ? result.ispersonaldetails : false
  obj['isbusinessdetails'] = result.isbusinessdetails ? result.isbusinessdetails : false
  if (private) {
    if (result.isinfostatus != undefined && result.isinfostatus == true) {
      if (group) {
        obj['dob'] = result.dob ? result.dob : ''
        obj['bloodgroup'] = result.bloodgroup ? result.bloodgroup : ''
        obj['phonenumber'] = result.phonenumber ? result.phonenumber : ''
        obj['cc'] = result.cc ? result.cc : ''
        obj['education'] = result.education ? result.education : ''
      }
    }
  } else {
    obj['dob'] = result.dob ? result.dob : ''
    obj['bloodgroup'] = result.bloodgroup ? result.bloodgroup : ''
    obj['phonenumber'] = result.phonenumber ? result.phonenumber : ''
    obj['cc'] = result.cc ? result.cc : ''
    obj['education'] = result.education ? result.education : ''
  }
  obj['location'] = result.location ? result.location : ''
  obj['work'] = result.work ? result.work : ''
  obj['designation'] = result.designation ? result.designation : ''
  obj['businesslocation'] = result.businesslocation ? result.businesslocation : ''
  obj['businessphonenumber'] = result.businessphonenumber ? result.businessphonenumber : ''
  obj['businesscc'] = result.businesscc ? result.businesscc : ''
  obj['skill'] = result.skill ? result.skill : []
  obj['applink'] = applinkArr.length > 0 ? (reverse ? applinkArr.reverse() : applinkArr) : []
  obj['applinkstatus'] = applinkstatusArr.length > 0 ? applinkstatusArr : []
  obj['displayApp'] = displayArr.length > 0 ? displayArr : []
  obj['isinfostatus'] = result.isinfostatus ? result.isinfostatus : false
  obj['status'] = result.status ? result.status : false
  return obj
}

Router.get('/viewProfile', verifyToken, function (req, res) {
  const { email } = req;
  DB.GetOneDocument('users', { email: email }, project, { populate: 'applinkstatus.appid applink.id' }, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      let finalValue = {}
      let reverse = false
      if (req.query.reverseStatus) {
        reverse = true
      }
      if (result != null) {
        finalValue = viewUserDetails(result, false, reverse, false)
      }

      return res.status(200).json(finalValue);
    }
  });
});

Router.get('/viewProfileUniqueId/:id', function (req, res) {
  DB.GetOneDocument('users', { uniqueid: req.params.id }, project, { populate: 'applinkstatus.appid applink.id' }, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      let finalValue = {}
      if (result != null) {
        finalValue = viewUserDetails(result, true, false, true)
      }
      return res.status(200).json(finalValue);
    }
  });
});

Router.get('/viewProfileUserName/:id', function (req, res) {
  DB.GetOneDocument('users', { _id: req.params.id }, project, { populate: 'applinkstatus.appid applink.id' }, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      let finalValue = {}
      if (result != null) {
        finalValue = viewUserDetails(result, true, false, false)
      }
      return res.status(200).json(finalValue);
    }
  });
});

Router.post('/listSocialMediaDrag', verifyToken, function (req, res) {
  const { email } = req;
  var socialmedia = req.body.socialmedia
  if (socialmedia != null && socialmedia.length > 0) {
    let arr = []
    for (let i = 0; i < socialmedia.length; i++) {
      arr.push({
        id: i + 1,
        duplicateId: socialmedia[i].duplicateId,
        logo: socialmedia[i].logo,
        name: socialmedia[i].name,
        link: socialmedia[i].link
      })
    }
    DB.FindUpdateDocument('users', { email: email }, { sociallink: arr }, function (err, result) {
      if (err) {
        res.status(400).end();
      }
    });
    DB.GetOneDocument('users', { email: email }, project, {}, function (err, result) {
      if (err) {
        res.status(400).end();
      } else {
        if (result != null) {
          var sociallink = (result.sociallink && result.sociallink.length > 0) ? result.sociallink : []
          return res.status(200).json(sociallink);
        } else {
          return res.status(200).json([]);
        }
      }
    });
  } else {
    return res.status(200).json([]);
  }

});

Router.get('/listUser', verifyToken, function (req, res) {
  var query = {};
  const { cardtype } = req.query;
  if (cardtype) {
    query['cardtype'] = req.query.cardtype
  }
  DB.GetDocument('users', query, {}, { sort: { createdAt: -1 } }, function (err, result) {
    DB.GetDocument('loginhistories', {}, {}, { sort: { createdAt: -1 } }, function (err, loginHistory) {
      DB.GetDocument('savecontacthistories', {}, {}, { sort: { createdAt: -1 } }, function (err, saveContact) {
        if (err) {
          res.status(400).end();
        } else {
          const tempRes = result.map((item, i) => {
            let obj = {};
            let countsave = 0
            let loginsave = 0
            let lastLoginDate = ''
            if (saveContact.length > 0) {
              saveContact.map((save) => {
                if (save.user.equals(item._id)) {
                  countsave += 1
                }
              })
            }
            let login = []
            if (loginHistory && loginHistory.length > 0) {
              loginHistory.map((item1, i) => {
                if ((item1.user).equals(item._id)) {
                  login.push({
                    time: item1.time ? item1.time : ''
                  })
                }
              });
            }
            let addressArr = [];
            let address = item.applink;
            if (address.length > 0) {
              address.map((getAddress) => {
                let inputType = getAddress.inputtype;
                if (inputType == 'address') {
                  addressArr.push(getAddress.address);
                }
              })
            }

            let addressValue = '';
            if (addressArr.length > 0) {
              addressArr.map((address) => {
                addressValue = address.street + ' , ' + address.city + ' , ' + address.state + ' , ' + address.country + ' - ' + address.zip;
              })
            }

            obj['_id'] = item._id;
            obj['username'] = item.username ? item.username : '';
            obj['email'] = item.email ? item.email : '';
            obj['phonenumber'] = item.phonenumber ? ((item.cc ? item.cc.value : '') + ' ' + item.phonenumber) : '';
            obj['headline'] = item.headline ? item.headline : '';
            obj['displayname'] = item.displayname ? item.displayname : '';
            obj['address'] = addressValue ? addressValue : '';
            obj['uniqueid'] = item.uniqueid ? item.uniqueid : '';
            obj['cardtype'] = item.cardtype ? item.cardtype : '';
            obj['countsave'] = countsave;
            obj['loginsave'] = login.length;
            obj['lastlogindate'] = login.length > 0 ? login[0].time ? moment(login[0].time).format("MM-DD-YYYY ddd hh:mm A") : "" : [];
            obj['status'] = item.status ? item.status : item.status;
            return obj
          });
          return res.status(200).json(tempRes);
        }
      });
    });
  });
});

Router.get('/viewUser/:id', verifyToken, function (req, res) {
  DB.GetOneDocument('users', { _id: req.params.id }, project, { populate: 'applinkstatus.appid applink.id' }, function (err, result) {
    DB.GetDocument('savecontacthistories', { user: req.params.id }, {}, { populate: 'user saver', sort: { time: -1 } }, function (err, saveContact) {
      DB.GetDocument('loginhistories', { user: req.params.id }, {}, { populate: 'user', sort: { createdAt: -1 } }, function (err, loginHistory) {
        if (err) {
          res.status(400).end();
        } else {
          let SaveContact = {}
          let repeatedArr = []
          if (saveContact && saveContact.length > 0) {
            saveContact.map((item, i) => {
              let status = repeatedArr.includes(item.user._id)
              repeatedArr.push(item.user._id)
              if (!status) {
                let saverHistory = []
                saveContact.map((item1) => {
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
                SaveContact['saverHistory'] = saverHistory.length > 0 ? saverHistory : []
                SaveContact['countContactSaver'] = saveContact.length
              }
            });
          }

          let LoginHistories = {}
          if (loginHistory && loginHistory.length > 0) {
            let login = []
            loginHistory.map((item, i) => {
              let obj = {};
              obj['_id'] = item._id
              obj['username'] = item.user ? item.user.username : ''
              obj['email'] = item.user ? item.user.email : ''
              obj['displayname'] = item.user ? item.user.displayname : ''
              obj['time'] = item.time ? item.time : '';
              obj['ip'] = item.ip ? item.ip : '';
              obj['device'] = item.device ? item.device : '';
              obj['addresss'] = item.city ? item.city + ", " + item.region + ", " + item.country + " - " + item.postal : '';
              obj['city'] = item.city ? item.city : '';
              obj['region'] = item.region ? item.region : '';
              obj['country'] = item.country ? item.country : '';
              obj['countrycode'] = item.countrycode ? item.countrycode.toLowerCase() : '';
              obj['latitude'] = item.latitude ? item.latitude : '';
              obj['longitude'] = item.longitude ? item.longitude : '';
              obj['postal'] = item.postal ? item.postal : '';
              obj['currency'] = item.currency ? item.currency : '';
              obj['status'] = item.status ? item.status : 0;
              login.push(obj)
            });
            LoginHistories['loginHistory'] = login
            LoginHistories['countLoginHistory'] = loginHistory.length
          }
          let output = {}
          if (result != null) {
            let finalValue = viewUserDetails(result, false, false, true)
            output = { ...finalValue, ...SaveContact, ...LoginHistories }
          }
          return res.status(200).json(output);
        }
      });
    });
  });
});

Router.post('/updateUser/:id', verifyToken, cpUpload, async function (req, res) {
  const { accountDetails, email, ID } = req;

  const usernameAlready = await db.users.findOne({ username: req.body.username }).select('_id');
  if (usernameAlready != null) {
    if (usernameAlready._id != req.params.id) {
      res.statusMessage = "Email already exist for this hotel";
      return res.status(407).end();
    }
  }
  const emailAlready = await db.users.findOne({ email: (req.body.email).toLowerCase() }).select('_id');
  if (emailAlready != null) {
    if (emailAlready._id != req.params.id) {
      res.statusMessage = "Email already exist for this hotel";
      return res.status(408).end();
    }
  }
  const uniqueAlready = await db.users.findOne({ uniqueid: req.body.uniqueid }).select('_id');
  if (uniqueAlready != null) {
    if (uniqueAlready._id != req.params.id) {
      res.statusMessage = "Email already exist for this hotel";
      return res.status(409).end();
    }
  }
  var updateInfo = {
    username: req.body.username ? req.body.username : '',
    email: req.body.email ? (req.body.email).toLowerCase() : '',
    uniqueid: req.body.uniqueid ? (req.body.uniqueid).toUpperCase() : '',
    cardtype: req.body.cardtype ? req.body.cardtype : '',
  }
  DB.UpdateDocument('users', { _id: req.params.id }, updateInfo, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      res.statusMessage = "Updated Successfully";
      return res.status(200).json(result);
    }
  });
});

Router.post('/vCardGenerate', function (req, res) {
  let query = {}
  if (req.body.uniqueid) {
    query['uniqueid'] = req.body.uniqueid
  } else {
    query['_id'] = req.body.id
  }
  DB.GetOneDocument('users', query, project, { populate: 'applinkstatus.appid applink.id' }, async function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      if (result != null) {

        // ---------------------------------save contact history ----------------------------

        var unknowHistory = ''
        var saverHistory = ''
        if (req.body.saverId) {
          saverHistory = await db.savecontacthistories.findOne({ user: result._id, saver: req.body.saverId });
        } else {
          unknowHistory = await db.savecontacthistories.findOne({ user: result._id, ip: req.body.ip });
        }
        if (!unknowHistory) {
          if (!saverHistory) {
            const formData = {
              user: result._id ? result._id : null,
              time: req.body.time ? req.body.time : "",
              ip: req.body.ip ? req.body.ip : "",
              city: req.body.city ? req.body.city : "",
              country: req.body.country ? req.body.country : "",
              uniqueid: req.body.uniqueid ? req.body.uniqueid : "",
              count: "1",
            }
            if (req.body.saverId) formData['saver'] = req.body.saverId ? req.body.saverId : null
            DB.InsertDocument('savecontacthistories', formData, function (err, result) {
              if (err) {
                res.status(400).end();
              }
            });
          }
        }

        // ---------------------------------v card ---------------------------------------------------------

        let linkObject = []
        let addressObject = []
        let phoneObject = []
        let emailObject = []
        let documentObject = []
        let noneObject = []

        if (result.applink && result.applink.length > 0) {
          result.applink.map((item) => {
            if (item.id) {
              let find = result.applinkstatus.length > 0 ? result.applinkstatus.find((e) => e.appid._id == item.id.parentid) : ''
              if (find) {
                if (find.appid.status) {
                  if (find.status) {
                    if (item.id.appname) {
                      if (item.inputtype == 'address') {
                        addressObject.push({
                          id: item.id ? item.id._id : '',
                          name: item.id ? ((item.id.appname).replace(/ /g, "")) : '',
                          address: item.address ? item.address : '',
                        })
                      }
                      if (item.inputtype == 'url') {
                        linkObject.push({
                          id: item.id ? item.id._id : '',
                          name: item.id ? ((item.id.appname).replace(/ /g, "")) : '',
                          link: item.link ? item.link : '',
                        })
                      }
                      if (item.inputtype == 'email') {
                        emailObject.push({
                          id: item.id ? item.id._id : '',
                          name: item.id ? ((item.id.appname).replace(/ /g, "")) : '',
                          value: item.value ? item.value : '',
                        })
                      }
                      if (item.inputtype == 'number') {
                        phoneObject.push({
                          id: item.id ? item.id._id : '',
                          name: item.id ? ((item.id.appname).replace(/ /g, "")) : '',
                          value: item.value ? item.value : '',
                        })
                      }
                      if (item.inputtype == 'document') {
                        if (item.documentstatus != undefined && item.documentstatus) {
                          documentObject.push({
                            id: item.id ? item.id._id : '',
                            name: item.id ? ((item.id.appname).replace(/ /g, "")) : '',
                            value: item.value ? item.value : '',
                            documentstatus: item.documentstatus ? item.documentstatus : false,
                          })
                        }
                      }
                      if (item.inputtype == 'none') {
                        noneObject.push({
                          id: item.id ? item.id._id : '',
                          name: item.id ? ((item.id.appname).replace(/ /g, "")) : '',
                          value: item.value ? item.value : '',
                        })
                      }
                    }
                  }
                }
              }
            }
          })
        }
        let cardData = vcardData(result, linkObject, addressObject, phoneObject, emailObject, noneObject, documentObject, req, req.body.group)
        if (cardData != undefined) {
          cardData.then(function (data) {
            return res.status(200).json(data);
          })
        } else {
          return res.status(200).json({});
        }
      } else {
        return res.status(200).end();
      }
    }
  });
});

Router.get('/viewPrivateAccount/:id', function (req, res) {
  DB.GetOneDocument('users', { username: req.params.id }, project, {}, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      if (result != null) {
        let obj = {}
        obj['id'] = result._id ? result._id : ''
        obj['status'] = (result.ispublicprofile != undefined) ? (result.ispublicprofile ? result.ispublicprofile : false) : true
        return res.status(200).json(obj);
      } else {
        return res.status(200).end();
      }
    }
  });
});


Router.post('/vCardGenerateOwner', function (req, res) {
  let query = {}
  query['_id'] = req.body.id
  DB.GetOneDocument('users', query, project, { populate: 'applinkstatus.appid applink.id' }, async function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      if (result != null) {
        let linkObject = []
        let addressObject = []
        let phoneObject = []
        let emailObject = []
        let documentObject = []
        let noneObject = []
        if (result.applink && result.applink.length > 0) {
          result.applink.map((item) => {
            if (item.id) {
              let find = result.applinkstatus.length > 0 ? result.applinkstatus.find((e) => e.appid._id == item.id.parentid) : ''
              if (find) {
                if (find.appid.status) {
                  if (item.id.appname) {
                    if (item.inputtype == 'address') {
                      addressObject.push({
                        id: item.id ? item.id._id : '',
                        name: item.id ? ((item.id.appname).replace(/ /g, "")) : '',
                        address: item.address ? item.address : '',
                      })
                    }
                    if (item.inputtype == 'url') {
                      linkObject.push({
                        id: item.id ? item.id._id : '',
                        name: item.id ? ((item.id.appname).replace(/ /g, "")) : '',
                        link: item.link ? item.link : '',
                      })
                    }
                    if (item.inputtype == 'email') {
                      emailObject.push({
                        id: item.id ? item.id._id : '',
                        name: item.id ? ((item.id.appname).replace(/ /g, "")) : '',
                        value: item.value ? item.value : '',
                      })
                    }
                    if (item.inputtype == 'number') {
                      phoneObject.push({
                        id: item.id ? item.id._id : '',
                        name: item.id ? ((item.id.appname).replace(/ /g, "")) : '',
                        value: item.value ? item.value : '',
                        cc: item.cc ? item.cc : '',
                      })
                    }
                    if (item.inputtype == 'document') {
                      documentObject.push({
                        id: item.id ? item.id._id : '',
                        name: item.id ? ((item.id.appname).replace(/ /g, "")) : '',
                        value: item.value ? item.value : '',
                        documentstatus: item.documentstatus ? item.documentstatus : false,
                      })
                    }
                    if (item.inputtype == 'none') {
                      noneObject.push({
                        id: item.id ? item.id._id : '',
                        name: item.id ? ((item.id.appname).replace(/ /g, "")) : '',
                        value: item.value ? item.value : '',
                      })
                    }
                  }
                }
              }
            }
          })
        }
        let cardData = vcardData(result, linkObject, addressObject, phoneObject, emailObject, noneObject, documentObject, req, true)
        if (cardData != undefined) {
          cardData.then(function (data) {
            return res.status(200).json(data);
          })
        } else {
          return res.status(200).json({});
        }
      } else {
        return res.status(200).end();
      }
    }
  });
});


async function vcardData(result, linkObject, addressObject, phoneObject, emailObject, noneObject, documentObject, req, group) {
  var vCard = vCardsJS();
  if (result.uniqueid) vCard.uid = result.uniqueid ? (result.uniqueid).toLowerCase() : ''
  if (result.displayname) vCard.firstName = result.displayname
  if (result.email) vCard.email = [result.email]
  if (result.email) vCard.workEmail = [result.email]
  if (result.headline) vCard.note = result.headline
  if (group) {
    if (result.dob) vCard.birthday = new Date(result.dob);
    if (result.bloodgroup) vCard.bloodgroup = result.bloodgroup
    if (result.phonenumber) vCard.cellPhone = [(result.cc ? result.cc.value + ' ' : '') + result.phonenumber]
    if (result.education) vCard.education = result.education
  }
  if (result.work) vCard.organization = result.work
  if (result.designation) vCard.role = result.designation
  if (result.businessphonenumber) vCard.workPhone = (result.businesscc ? result.businesscc.value + ' ' : '') + result.businessphonenumber
  if (emailObject.length > 0) {
    emailObject.map((e) => { vCard.email.push(e.value) })
  }
  if (phoneObject.length > 0) {
    if (vCard.cellPhone && vCard.cellPhone.length > 0) {
      phoneObject.map((e) => { vCard.cellPhone.push((e.cc ? e.cc : '') + " " + e.value) })
    } else {
      let arr = []
      phoneObject.map((e) => { arr.push((e.cc ? e.cc : '') + " " + e.value) })
      vCard.cellPhone = arr
    }
  }
  if (addressObject.length > 0) {
    for (let i = 0; i < 1; i++) {
      vCard.homeAddress.label = addressObject[i].name ? addressObject[i].name : "";
      vCard.homeAddress.street = addressObject[i].address ? addressObject[i].address.street : "";
      vCard.homeAddress.city = addressObject[i].address ? addressObject[i].address.city : "";
      vCard.homeAddress.stateProvince = addressObject[i].address ? addressObject[i].address.state : "";
      vCard.homeAddress.postalCode = addressObject[i].address ? addressObject[i].address.zip : "";
      vCard.homeAddress.countryRegion = addressObject[i].address ? addressObject[i].address.country : "";
    }
  }
  if (req.body.website) {
    if (result.image) {
      let photoUrl = `http://${LOCAL_ADDRESS}:${PORT}/`;
      let getImage = photoUrl + result.image
      let image = await axios.get(getImage, { responseType: 'arraybuffer' });
      let imageBase64 = Buffer.from(image.data).toString('base64');
      vCard.photo.embedFromString(imageBase64, 'image/jpeg');
    }
  }
  var vCardString = vCard.getFormattedString();
  vCardString.replace(/;CHARSET=UTF-8/g, "")
  var newData = ''
  var displayAddress = ''
  if (addressObject.length > 1) {
    for (let i = 1; i < addressObject.length; i++) {
      let item = addressObject[i].address ? addressObject[i].address : ''
      if (item) {
        let location = (item.street ? (item.street).replace(/,/g, "") + ',' : "") + (item.city ? (item.city).replace(/,/g, "") + "," : "") + (item.state ? (item.state).replace(/,/g, "") + ',' : "") + (item.country ? (item.country).replace(/,/g, "") : "")
        const mapUrl = `https://www.google.com/maps/place/${encodeURIComponent(location)}`;
        displayAddress += 'X-SOCIALPROFILE;TYPE=' + addressObject[i].name + ':' + mapUrl + '\n';
      }
    }
  }
  var displayNotes = ''
  if (noneObject.length > 0) {
    for (let i = 0; i < noneObject.length; i++) {
      displayNotes += 'X-SOCIALPROFILE;TYPE=' + noneObject[i].name + ':' + noneObject[i].value + '\n';
    }
  }

  var displayDocument = ''
  if (group) {
    if (documentObject.length > 0) {
      for (let i = 0; i < documentObject.length; i++) {
        displayDocument += 'X-SOCIALPROFILE;TYPE=' + documentObject[i].name + ':' + dbConfig.S3FILEURL + documentObject[i].value + '\n';
      }
    }
  }
  if (!req.body.website) {
    if (result.image) {
      let photoUrl = `http://${LOCAL_ADDRESS}:${PORT}/`;
      let getImage = photoUrl + result.image
      let image = await axios.get(getImage, { responseType: 'arraybuffer' });
      if (image) {
        let imageBase64 = Buffer.from(image.data).toString('base64');
        let images = "PHOTO;ENCODING=b;TYPE=image/jpeg:" + imageBase64 + '\n'
        let socialLink = ''
        if (linkObject.length > 0) {
          linkObject.map((item) => {
            socialLink += 'X-SOCIALPROFILE;TYPE=' + item.name + ':' + item.link + '\n';
          })
        }
        var today = new Date();
        socialLink = images + displayAddress + socialLink + displayDocument + displayNotes + 'REV:' + (today.toISOString()).toString();
        var revString = vCardString.slice(vCardString.indexOf('REV:20'), vCardString.indexOf('Z') + 1);
        newData = vCardString.replace(revString, socialLink);
      }
    } else {
      let socialLink = ''
      if (linkObject.length > 0) {
        linkObject.map((item) => {
          socialLink += 'X-SOCIALPROFILE;TYPE=' + item.name + ':' + item.link + '\n';
        })
      }
      var today = new Date();
      socialLink = displayAddress + socialLink + displayDocument + displayNotes + 'REV:' + (today.toISOString());
      var revString = vCardString.slice(vCardString.indexOf('REV:20'), vCardString.indexOf('Z') + 1);
      newData = vCardString.replace(revString, socialLink);
    }
  }
  return sendData = {
    vcard: req.body.website ? vCardString : newData,
    username: result.username
  }
}

Router.post('/forgotPassword', function (req, res) {
  DB.GetOneDocument('users', { email: req.body.email }, {}, {}, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      if (result) {
        const generatedPassword = helperFunction.generatePassword();
        const filePath = path.join(__dirname, '../../models/email/forgotpassword.html');
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);
        const replacements = {
          'name': result.username ? result.username : "User",
          'password': generatedPassword,
          'image': ' https://acwcard.com/assets/images/acw_card_logo.png'
        };
        const htmlToSend = template(replacements);
        var mailOptions = {
          from: 'info@acwcircle.com',
          to: req.body.email,
          subject: "Password updated!",
          html: htmlToSend,
        };
        const newPassword = bcrypt.hashSync(generatedPassword, bcrypt.genSaltSync(8), null);
        DB.FindUpdateDocument('users', { email: req.body.email }, { password: newPassword }, function (err, result) {
          if (err) {
            res.status(400).end();
          } else {
            MailSend(mailOptions, function (error, response) {
              if (response) {
                res.statusMessage = "Check mail for new password";
                return res.status(200).end();
              } else {
                res.statusMessage = "Something wrong, Retry again!";
                return res.status(401).end();
              }
            });
          }
        });
      } else {
        res.statusMessage = "Email does not exit";
        return res.status(510).end();
      }
    }
  });
});

Router.get('/deleteUser/:id', async function (req, res) {
  DB.DeleteDocument('users', { _id: req.params.id }, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      return res.status(200).json(result);
    }
  });
})


Router.get('/userCardCount', verifyToken, async function (req, res) {
  var query = {};

  async.parallel([
    function (callback) {
      DB.GetDocument('users', { ...query }, {}, {}, function (err, result1) {
        callback(null, result1);
      })
    },
    function (callback) {
      DB.GetDocument('users', { ...query, cardtype: '1' }, {}, {}, function (err, result2) {
        callback(null, result2);
      })
    },
    function (callback) {
      DB.GetDocument('users', { ...query, cardtype: '2' }, {}, {}, function (err, result3) {
        callback(null, result3);
      })
    },
    function (callback) {
      DB.GetDocument('users', { ...query, cardtype: '3' }, {}, {}, function (err, result4) {
        callback(null, result4);
      })
    },
    function (callback) {
      DB.GetDocument('users', { ...query, cardtype: '4' }, {}, {}, function (err, result5) {
        callback(null, result5);
      })
    },
    function (callback) {
      DB.GetDocument('users', { ...query, cardtype: '5' }, {}, {}, function (err, result6) {
        callback(null, result6);
      })
    },
    function (callback) {
      DB.GetDocument('users', { ...query, cardtype: '6' }, {}, {}, function (err, result7) {
        callback(null, result7);
      })
    },
    function (callback) {
      DB.GetDocument('users', { ...query, cardtype: '7' }, {}, {}, function (err, result7) {
        callback(null, result7);
      })
    },
  ],
    function (err, results) {
      const response = {
        allcard: results[0] ? results[0].length : 0,
        cardtype1: results[1] ? results[1].length : 0,
        cardtype2: results[2] ? results[2].length : 0,
        cardtype3: results[3] ? results[3].length : 0,
        cardtype4: results[4] ? results[4].length : 0,
        cardtype5: results[5] ? results[5].length : 0,
        cardtype6: results[6] ? results[6].length : 0,
        cardtype7: results[7] ? results[7].length : 0,
      }
      res.status(200).json(response)
    });
});

Router.post('/updateUserPasswordChange', function (req, res) {
  const password = bcrypt.hashSync(req.body.adminpassword, bcrypt.genSaltSync(8), null);
  var formData = {
    adminpassword: password
  }
  DB.UpdateManyDocument('users', {}, formData, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      return res.status(200).json(result);
    }
  });
})


Router.post('/updateTapCardStatus', verifyToken, async function (req, res) {
  const { accountDetails, email, ID } = req;
  let updateInfo = {
    tapStatus: req.body.tapStatus ? req.body.tapStatus : false,
    tapTimeStatus: new Date(),
  }
  DB.UpdateDocument('users', { email: email }, updateInfo, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      res.statusMessage = "Updated Successfully";
      return res.status(200).json(result);
    }
  });
});


cron.schedule('*/1 * * * *', () => {
  const date = new Date()
  const end = new Date(new Date().getTime() - 5 * 60000);
  const start = new Date(new Date().getTime() - 6 * 60000);
  const onemin = new Date(new Date().getTime() - 1 * 60000);

  let query = {};
  let queryFive = {};
  query['isinfostatus'] = true
  query['tapStatus'] = true
  query['tapTimeStatus'] = { $gt: onemin, $lt: date }

  DB.GetDocument('users', query, {}, {}, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      if (result.length > 0 && result != null) {
        result.map((item) => {
          DB.FindUpdateDocument('users', { _id: item._id }, { isinfostatus: false, tapStatus: false }, function (err, result1) {
            if (err) {
              console.log(err)
            }
          })
        })
      }
    }
  })
  queryFive['isinfostatus'] = true
  queryFive['infoTimeStatus'] = { $gt: start, $lt: end }
  DB.GetDocument('users', queryFive, {}, {}, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      if (result.length > 0 && result != null) {
        result.map((item) => {
          DB.FindUpdateDocument('users', { _id: item._id }, { isinfostatus: false }, function (err, result1) {
            if (err) {
              console.log(err)
            }
          })
        })
      }
    }
  })
});

module.exports = Router;
