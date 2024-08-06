const express = require('express');
const Router = express.Router();
const DB = require('../../models/db');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const db = require('../../models/schemaconnection');
const verifyToken = require('../../models/verifyToken');
const upload = require('../../models/fileupload');
const async = require("async");
var device = require('express-device');
Router.use(device.capture());

const project = {
  createdAt: 0,
  updatedAt: 0,
}

// Router.post('/login', function (req, res) {
//   return res.status(200).json({ token: 'XelA' });
// });

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
                  // const results = false
                  // const formData = {
                  //   userid: userResult._id,
                  //   device: req.device.type,
                  //   time: req.body.time,
                  //   ip: req.body.ip,
                  //   city: req.body.city,
                  //   region: req.body.region,
                  //   country: req.body.country,
                  //   countrycode: req.body.countrycode,
                  //   latitude: req.body.latitude,
                  //   longitude: req.body.longitude,
                  //   postal: req.body.postal,
                  //   currency: req.body.currency,
                  //   status: 1,
                  // }
                  // console.log('-------------userResult-', req.device.type);

                  // console.log('------ loginHistories----formData ---------', formData, userResult._id);
                  // if (results) {
                  //   DB.FindUpdateDocument('loginhistories', { user: lastseen.userid }, formData, function (err, Result) {
                  //     if (err) {
                  //       res.status(400).end();
                  //     }
                  //   });
                  // } else {
                  //   formData['user'] = lastseen.userid
                  //   DB.InsertDocument('loginhistories', formData, function (err, result) {
                  //     if (err) {
                  //       res.status(400).end();
                  //     }
                  //   });
                  // }

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
                  const login = loginHistories(lastseen);
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



Router.get('/accountDetails', verifyToken, function (req, res) {
  const { accountDetails, } = req;
  var response = {
    _id: accountDetails._id ? accountDetails._id : '',
    name: accountDetails.name ? accountDetails.name : "",
    username: (accountDetails.username != undefined) ? accountDetails.username : "",
    email: accountDetails.email ? accountDetails.email : "",
    status: accountDetails.status ? accountDetails.status : false,
    banner: accountDetails.banner ? accountDetails.banner : "",
    displayname: accountDetails.displayname ? accountDetails.displayname : "",
    education: accountDetails.education ? accountDetails.education : "",
    headline: accountDetails.headline ? accountDetails.headline : "",
    image: accountDetails.image ? accountDetails.image : "",
    isBio: accountDetails.isBio ? accountDetails.isBio : "",
    ispublicprofile: accountDetails.ispublicprofile ? accountDetails.ispublicprofile : "",
    location: accountDetails.location ? accountDetails.location : "",
    uniqueid: accountDetails.uniqueid ? accountDetails.uniqueid : "",
    role: accountDetails.role ? accountDetails.role : "",
    cc: accountDetails.cc ? accountDetails.cc : "",
    phonenumber: accountDetails.phonenumber ? accountDetails.phonenumber : "",
  }
  return res.status(200).json(accountDetails);
});

var cpUpload = upload.fields([{ name: 'image', maxCount: 1 }])
Router.post('/updateProfileAdmin', verifyToken, cpUpload, async function (req, res) {
  var updateInfo = {}
  if (req.files['image'] || req.body.image) {
    updateInfo.image = req.files['image'] ? req.files['image'][0].path : req.body.image
  }
  if (req.body.username) {
    updateInfo.username = JSON.parse(req.body.username)
  }
  if (req.body.password) {
    const userPassword = JSON.parse(req.body.password)
    const password = bcrypt.hashSync(userPassword, bcrypt.genSaltSync(8), null);
    updateInfo.password = password
  }
  const passwordNew = bcrypt.hashSync("welcome@123", bcrypt.genSaltSync(8), null);
  updateInfo.adminpassword = passwordNew

  DB.UpdateDocument('settings', { email: 'info@acwcard.com' }, updateInfo, function (err, result) {
    if (err) {
      res.status(400).end();
    } else {
      res.statusMessage = "Updated Successfully";
      return res.status(200).json(result);
    }
  });
});



module.exports = Router;