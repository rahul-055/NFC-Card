const express = require('express');
const Router = express.Router();
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');
const DB = require('../../models/db');
const { MailSend } = require('../../mailer');
const moment = require('moment');

const { SendEnquiryEmail } = require('../../models/helperfunctions');

const project = {
    createdAt: 0,
    updatedAt: 0,
}
Router.post('/addEnquiry', async function (req, res) {
    const formData = {
        firstname: req.body.firstname ? helperFunction.Capitalize(req.body.firstname) : '',
        lastname: req.body.lastname ? req.body.lastname : '',
        phonenumber: req.body.phonenumber ? req.body.phonenumber : '',
        email: req.body.email ? (req.body.email).toLowerCase() : '',
        message: req.body.message ? helperFunction.Capitalize(req.body.message) : '',
        status: 1,
        isDeleted: 0,
    }
    DB.InsertDocument('enquires', formData, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            SendEnquiryEmail(result);
            res.statusMessage = "Feedback sent successfully";
            return res.sendStatus(200);
        }
    });
});

Router.get('/listEnquiry', function (req, res) {
    DB.GetDocument('enquires', {}, {}, { sort: { createdAt: -1 } }, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            if (result) {
                const tempRes = result.map((item, i) => {
                    let obj = {};
                    obj['_id'] = item._id ? item._id : '';
                    obj['phonenumber'] = item.phonenumber ? item.phonenumber : '';
                    obj['firstname'] = item.firstname ? item.firstname : '';
                    obj['lastname'] = item.lastname ? item.lastname : '';
                    obj['email'] = item.email ? item.email : '';
                    obj['message'] = item.message ? item.message : '';
                    obj['createdAt'] = item.createdAt ? moment(item.createdAt).format("MM-DD-YYYY ddd hh:mm A") : '';
                    obj['status'] = item.status ? item.status : '';
                    return obj
                })
                return res.status(200).json(tempRes);
            }
        }
    });
});

Router.get('/viewEnquiry/:id', function (req, res) {
    DB.GetOneDocument('enquires', { _id: req.params.id }, {}, {}, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            let obj = {};
            obj['_id'] = result ? result._id : '';
            obj['phonenumber'] = result ? result.phonenumber : '';
            obj['firstname'] = result ? result.firstname : '';
            obj['lastname'] = result ? result.lastname : '';
            obj['email'] = result ? result.email : '';
            obj['message'] = result ? result.message : '';
            obj['createdAt'] = result.createdAt ? moment(result.createdAt).format("MM-DD-YYYY ddd hh:mm A") : '';
            return res.status(200).json(obj);
        }
    });
});

Router.post('/sendMail', function (req, res) {
    const filePath1 = path.join(__dirname, '../../models/email/enquiry.html');
    const source1 = fs.readFileSync(filePath1, 'utf-8').toString();
    const template1 = handlebars.compile(source1);
    const replacements1 = {
        name: "hiii"
    };
    const htmlToSend1 = template1(replacements1);
    var mailOptions1 = {
        to: 'rahul@acwcircle.com ',
        // to: 'info@acwcircle.com,aravind@acwcircle.com,hr@acwcircle.com',
        subject: "we have received new enquiry from ACWcard",
        html: htmlToSend1,
    };
    MailSend(mailOptions1, function (error, response) {
    });
    return res.status(200).end();
})


Router.post('/sendSms', function (req, res) {
    const filePath1 = path.join(__dirname, '../../models/email/enquiry.html');
    const source1 = fs.readFileSync(filePath1, 'utf-8').toString();
    const template1 = handlebars.compile(source1);
    const replacements1 = {
        name: "sms"
    };
    const htmlToSend1 = template1(replacements1);
    var mailOptions1 = {
        to: 'rahul@acwcircle.com ',
        // to: 'info@acwcircle.com,aravind@acwcircle.com,hr@acwcircle.com',
        subject: "we have received new enquiry from ACWcard",
        html: htmlToSend1,
    };
    MailSend(mailOptions1, function (error, response) {
    });
    return res.status(200).end();
})

module.exports = Router;