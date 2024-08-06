var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var APP = {
    name: String,
    parentid: String,
    appname: String,
    inputtype: String,
    sortorder: Number,
    logo: String,
    status: Boolean,
    isdeleted: Boolean,
};

module.exports = APP;
