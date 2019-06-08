//Reference core node libraries
const mongoose = require('mongoose');
var express = require('express');

//Initialize express app
var app = express();

//Declare HTML handling resources
var body_parser = require('body-parser');
var multer  = require('multer');
var upload = multer({dest: './public/uploads/'});

//Reference security resources
var https = require('https');
var jwt = require("jsonwebtoken");
var options = {};

//Reference models
var user = require('./api/models/user');

//Connect to MongoDB cluster
var conn_url = 'mongodb://admin:Pass.3280416@' +
  'cluster0-shard-00-00-axsa2.mongodb.net:27017,' +
  'cluster0-shard-00-01-axsa2.mongodb.net:27017,' +
  'cluster0-shard-00-02-axsa2.mongodb.net:27017/scv-db?' +
  'ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
mongoose.connect(conn_url, {useNewUrlParser: true});

//Verify MongoDB cluster connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Successfully connected to database!');
});

//Initialize HTML handling resources
app.use(express.static('./public'));
app.use(body_parser.urlencoded({extended: true}));
app.use(body_parser.json());

//Verify JWT token
app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] == 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'RESTfulAPI', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

//Register routes
var routes = require('./api/routes/routes');
routes(app);

//Initialize app resources
app.listen(process.env.PORT || 80);
//https.createServer(options, app).listen(443);

//Log start of API
console.log('Successfully started API!');