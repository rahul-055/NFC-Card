var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SAVECONTACTHISTORY = {
    saver: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    time: String,
    ip: String,
    city: String,
    country: String,
    count: String,
    status: Boolean,
}
module.exports = SAVECONTACTHISTORY;

