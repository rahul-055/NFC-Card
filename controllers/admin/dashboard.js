const express = require('express');
const { log } = require('handlebars');
const Router = express.Router();
const DB = require('../../models/db');
const project = {
    createdAt: 0,
    updatedAt: 0,
}

Router.get('/countSaveContactDashboard', verifyToken, function (req, res) {
    DB.GetDocument('savecontacthistories', {}, {}, { populate: 'user saver', sort: { time: -1 } }, function (err, results) {
        if (err) {
            res.status(400).end();
        } else {
            var arrA = {};
            for (var index = 0; index < results.length; index++) {
                if (results[index].user != null && results[index].user) {
                    var tryb = results[index].user ? results[index].user.username : '';
                    if (!arrA[tryb]) {
                        arrA[tryb] = {};
                        arrA[tryb].counter = 1;
                    } else {
                        arrA[tryb].counter += 1;
                    }
                }
            }
            return res.status(200).json(arrA);
        }
    });
});
module.exports = Router;