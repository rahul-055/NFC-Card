const multer = require('multer');

const DIR = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        var d = new Date();
        var randomName = d.getTime();
        const fileName = file.originalname ? file.originalname.toLowerCase().split(' ').join('-') : ""
        cb(null, randomName + fileName)
    }
});


var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('filefilefile', file);
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/octet-stream") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

module.exports = upload;


