const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//with local mongodb instead of mongoose to cloud mongo
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017/myproject';
 
// Database Name
//const dbName = 'users';

const app = express();
// to use environment port or otherwise 5000
const PORT = process.env.PORT || 5000;

//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;
//connect to Mongo:, return a Promise;
mongoose.connect(
    url,
    {useNewUrlParser: true, useUnifiedTopology: true}
    ).then(()=>console.log('connected to local Mongo DB....'))
    .catch(err =>{ console.log(err)});

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({extended: false}));

//express session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

  //connect flash
app.use(flash());

  // Global Vars

app.use((req, res, next)=>{
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');      
      next();
  });

//ROUTES
app.use('/', require('./routes/index'));

app.use('/users', require('./routes/users'));

app.listen(PORT, ()=>console.log(`Server is running on ${PORT}`));
//app.listen(PORT, ()=>console.log(process.env));