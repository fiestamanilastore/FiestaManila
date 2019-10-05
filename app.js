// Dependencies
var express = require('express');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var path = require('path');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var fs = require('fs');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://localhost:27017';

var port = process.env.PORT || 3000;

// initialize express
var app = express();

// bring in models
var User = require('./models/user');
var Image = require('./models/image')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
app.use(cookieParser());

// set up session middleware
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));

// Connect Flash
app.use(flash());

// Required to load stylesheets
app.use(express.static(path.join(__dirname, 'public')));

//Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

app.get('/', function(req, res) {
  res.render('index');
});

var server = app.listen(port, function() {
  console.log(`Server listening on port: '${port}'`);
})

// function getSlideshow(){
//   var ssLoc = "public/img/portfolio/slideshow/";
//   fs.readdir(ssLoc, (err, files) => {
//     if(err) {
//       console.log(err);
//     }
//
//     files.forEach(file => {
//       let tmp = `${ssLoc.slice(7)+file}`;
//       console.log(tmp);
//       slideshow.push(tmp);
//     });
//   })
// }

// app.get('/image/:image', function(req,res) {
//   var fileName = req.params.image;
//   mongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
//     if(err) {
//       console.log(err);
//     }
//     let db = client.db('FiestaManilaDB');
//     db.collection('images').findOne({'_id': ObjectId(fileName)}, function(err, results){
//       console.log(results);
//       res.contentType(results.contentType);
//       res.send(results.img);
//     })
//   })
// })

// Save images to MongoDB
// module.exports.saveImgs = function() {
//   mongoose.connect(config.database);
//   let db = mongoose.connection;
//
//   db.once('open', function(){
//     console.log('Connected to MongoDB');
//   })
//
//   // Check for db errors
//   db.on('error', function(err){
//     console.log(err);
//   })
//   var imgFolder = "public/img/portfolio/fullsize";
//   console.log(`Looping through all the pictures in ${imgFolder}`);
//   fs.readdir(imgFolder, (err, files) => {
//     files.forEach(file => {
//       console.log(path.join(__dirname, imgFolder+file ));
//       var tmpImg = new Image();
//       tmpImg.name = file.toString();
//       tmpImg.img = path.join(__dirname, imgFolder+file );
//       tmpImg.contentType = 'image/jpg';
//       tmpImg.save();
//       console.log(`Successfully loaded ${file.toString()}`);
//     });
//     if(err) {
//       console.log(err);
//     }
//   })
// }
