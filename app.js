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
var port = process.env.PORT || 3000;

mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', function(){
  console.log('Connected to MongoDB');
})

//Check for db errors
db.on('error', function(err){
  console.log(err);
})

// initialize express
var app = express();

// bring in models
var User = require('./models/user');

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

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

var isAuthenticated = false;

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/edit', function(req, res) {
  if(isAuthenticated == false){
    res.redirect('login');
  }else {
    res.render('edit');
  }
});

app.get('/login', function(req, res) {
  res.render('login');
})

app.post('/login', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;

  if(username=="admin" && password=="domingoe"){
    console.log("password matched");
    isAuthenticated = true;
    res.redirect('edit');
  }else {
    res.redirect('login');
  }
});

var server = app.listen(port, function() {
  console.log(`Server listening on port: '${port}'`);
})
