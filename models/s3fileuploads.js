const multer = require('multer');
const multerS3 = require('multer-s3');
const S3 = require('aws-sdk/clients/s3');
const db = require('./schemaconnection');
const { LiveStatus } = require('../config/db');
const ID = 'AKIA5H7AZ53DPWSZLA5U';
const SECRET = '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';
const bucketName = 'acwcircle-bucket';

const s3 = new S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const storage = multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: async function (req, file, cb) {
        let userId = ''
        if (req.UId) {
            userId = req.UId
        } else {
            userId = req.UserName
        }
        let uploads = 'ACWCard/';
        if (LiveStatus) {
            uploads += 'LiveData/'
        } else {
            uploads += 'LocalData/'
        }
        let fileFolder = ''
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            fileFolder = uploads + userId + '/images/'
        } else if (file.mimetype == "audio/mpeg" || file.mimetype == "audio/mp3") {
            fileFolder = uploads + userId + '/audio/'
        } else if (file.mimetype == "video/mp4") {
            fileFolder = uploads + userId + '/video/'
        } else if (file.mimetype == "application/pdf") {
            fileFolder = uploads + userId + '/pdf/'
        } else if (file.mimetype == "application/doc" || file.mimetype == "application/csv" || file.mimetype == "application/docx" || file.mimetype == "application/msword") {
            fileFolder = uploads + userId + '/doc/'
        } else if (file.mimetype == "image/octet-stream") {
            if (req.body.uniqueid) {
                fileFolder = uploads + req.body.uniqueid + '/barcode/'
            } else {
                fileFolder = uploads + 'barcode/'
            }
        } else {
            fileFolder = uploads + userId + '/others/'
        }
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileFolder + Date.now().toString() + fileName)
    }
})


var upload = multer({
    storage: storage,
});

module.exports = upload;
