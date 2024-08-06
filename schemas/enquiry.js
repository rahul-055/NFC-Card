var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ENQUIRY = {
    firstname: String,
    lastname: String,
    phonenumber: String,
    email: String,
    message: String,
    status: Boolean,
    isdeleted: Boolean,
};

module.exports = ENQUIRY;
