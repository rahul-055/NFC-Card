var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LOGINHISTORY = {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    time: String,
    ip: String,
    city: String,
    region: String,
    country: String,
    countrycode: String,
    latitude: String,
    longitude: String,
    postal: String,
    currency: String,
    device: String,
    status: Boolean,
}
module.exports = LOGINHISTORY;

