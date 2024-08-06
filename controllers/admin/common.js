const express = require('express');
const Router = express.Router();
const DB = require('../../models/db');

Router.post('/statusChange', function (req, res) {
    if (!req.body.model)
        res.status(400).end();
    DB.FindUpdateDocument(req.body.model, { _id: req.body.id }, { status: req.body.status }, function (err, result1) {
        if (err) {
            res.status(400).end();
        } else {
                return res.status(200).json(result1);
        }
    });
});


module.exports = Router;
