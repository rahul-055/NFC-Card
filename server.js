const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dbConfig = require('./config/db.js');
// const expressValidator = require('express-validator');
const path = require('path');
global.helperFunction = require('./models/helperfunctions')
global.verifyToken = require('./models/verifyToken.js');


// app.use(expressValidator())
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const DBURL = dbConfig.url;
const PORT = dbConfig.port;
const LOCAL_ADDRESS = dbConfig.hostname;
// Connecting to the database
mongoose.connect(DBURL, {
}).then(() => {
	console.log("Successfully connected to the database");
}).catch(err => {
	console.log('Could not connect to the database. Exiting now...', err);
	process.exit();
});
global.mongooseConnection = mongoose.connection;

mongoose.set('useFindAndModify', false);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

// importing routes files
require('./routes/')(app);


app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, LOCAL_ADDRESS, () => {
	console.log(`Server running at http://${LOCAL_ADDRESS}:${PORT}/`);
});