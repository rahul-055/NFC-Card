const express = require('express');
const Router = express.Router();
const DB = require('../../models/db');
// const db = require('../../models/schemaconnection');

const project = {
    createdAt: 0,
    updatedAt: 0,
}

Router.post('/addCategory', verifyToken, async function (req, res) {
    const formData = {
        name: helperFunction.UpperCase(req.body.name),
        previleges: JSON.parse(req.body.previleges),
        status: req.body.status ? req.body.status : 1,
    }
    DB.InsertDocument('categories', formData, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            DB.GetDocument('categories', {}, project, {}, function (err, result1) {
                if (err) {
                    res.status(400).end();
                } else {
                    res.statusMessage = "Category created successfully";
                    return res.status(201).json(result1);
                }
            });
        }
    });
});

Router.get('/listCategory', verifyToken, function (req, res) {
    DB.GetDocument('categories', {}, project, {}, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            return res.status(200).json(result);
        }
    });
});

Router.get('/viewCategory/:id', verifyToken, function (req, res) {
    DB.GetOneDocument('categories', { _id: req.params.id }, project, {}, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            return res.status(200).json(result);
        }
    });
});

Router.post('/updateCategory/:id', verifyToken, function (req, res) {
    const formData = {
        name: helperFunction.UpperCase(req.body.name),
        status: req.body.status ? req.body.status : 0,
        previleges: JSON.parse(req.body.previleges),
    }

    DB.FindUpdateDocument('categories', { _id: req.params.id }, formData, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            DB.GetDocument('categories', {}, project, {}, function (err, result1) {
                if (err) {
                    res.status(400).end();
                } else {
                    res.statusMessage = "Category updated successfully";
                    return res.status(200).json(result1);
                }
            });
        }
    });
});

Router.post('/deleteCategory/:id', verifyToken, function (req, res) {
    DB.DeleteDocument('categories', { _id: req.params.id }, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            DB.GetDocument('categories', {}, project, {}, function (err, result1) {
                if (err) {
                    res.status(400).end();
                } else {
                    res.statusMessage = "Category deleted successfully";
                    return res.status(200).json(result1);
                }
            });
        }
    });
});



module.exports = Router;
