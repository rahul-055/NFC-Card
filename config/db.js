// module.exports = {
//     url: 'mongodb://127.0.0.1:27017/acwcard-dev',
//     hostname: "localhost",
//     port: "9000"
// }

const live = false;
module.exports = {
    url: live ? 'mongodb+srv://ariescircleacwcard:3S6k2SgwTthWidTW@cluster0.d55d8mm.mongodb.net/cluster0?retryWrites=true&w=majority' : 'mongodb://127.0.0.1/acwcard-dev',
    hostname: live ? "0.0.0.0" : "localhost",
    port: "9000",
    LiveStatus: live,
    S3FILEURL: "https://acwcircle-bucket.s3.amazonaws.com/",
    siteurl: live ? "https://acwcard.com/" : "http://localhost:9000/",
}

