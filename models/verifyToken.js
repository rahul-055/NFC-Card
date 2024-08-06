// const DB = require('./db');
var jwt = require('jsonwebtoken');
const DB = require('./db');
const db = require('./schemaconnection');
const bcrypt = require('bcryptjs');

function verifyToken(req, res, next) {
	const bearerToken = req.headers['authorization'];
	jwt.verify(bearerToken, 'acwcard', (err, data) => {
		if (err) res.sendStatus(403);
		else {
			const project = {
				createdAt: 0,
				updatedAt: 0,
			}
			if (data.type == 'admin') {
				DB.GetOneDocument('settings', { email: data.email }, project, {}, function (err, result) {
					if (err) res.sendStatus(400);
					else {
						if (result) {
							let passswordCheck = (data.password != undefined && data.password) ? (data.password == result.password) : false
							let adminpassswordCheck = (data.adminpassword != undefined && data.adminpassword) ? (data.adminpassword == result.adminpassword) : false
							if (passswordCheck || adminpassswordCheck) {
								req.ID = result._id;
								req.email = data.email;
								req.accountDetails = result;
								req.name = "";
								req.city = "";
								req.state = "";
								req.hotelCode = "";
								req.hotelId = '';
								req.role = 'admin';
								req.type = 'admin';
								req.categoryType = '';
								next();
							} else {
								res.sendStatus(403)
							}
						} else {
							res.sendStatus(403)
						}
					}
				})
			} else {
				DB.GetOneDocument('users', { email: data.email }, project, {}, function (err, result) {
					if (err) res.sendStatus(400);
					else {
						if (result) {
							let passswordCheck = (data.password != undefined && data.password) ? (data.password == result.password) : false
							let adminpassswordCheck = (data.adminpassword != undefined && data.adminpassword) ? (data.adminpassword == result.adminpassword) : false
							if (passswordCheck || adminpassswordCheck) {
								req.ID = result._id;
								req.UserName = result.username;
								req.UId = result.uniqueid ? result.uniqueid : "";
								req.email = data.email;
								req.accountDetails = result;
								next();
							} else {
								res.sendStatus(403)
							}
						} else {
							res.sendStatus(403)
						}
					}
				})
			}
		}
	});
}
module.exports = verifyToken;

