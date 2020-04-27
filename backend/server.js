const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); //Environment Variable File
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
//Create Express App
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({credentials: true, origin: "http://localhost:3000"})); //For development purposes to allow cookie usage between, should be app.use(cors()) for production
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Connect to MongoDB 
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});
//MongoDB Session Storage
const sessionStore = new MongoStore({
   mongooseConnection: connection,
   collection: 'sessions'
});

//Enable Session Use for Express App
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
     maxAge: 1000 * 60 * 60 * 24 //Equals 1 day
  }
}))

//Function to Initialize the Cart
initializeCart = function(req, res, next) {
  if(typeof req.session.cart === "undefined") {
    req.session.cart = []
    console.log('Cart Initialized')
  }
  next()
}

checkAdmin = function(req, res, next) {
  if(req.session.user.userlevel === 'admin') {
     console.log('THIS USER IS AN ADMIN')
     //Set the session variable to retain admin status
     req.session.admin = true
     next()
  } else {
     res.status('401').redirect('/')
  }
  
}
//Set up App Specific Routers (NOTE: routers must be listed after "app.use(session)" for them to get session access)
const productsRouter = require('./routes/products.router');
const usersRouter = require('./routes/users.router');
const adminRouter = require('./routes/admin.router');
const cartRouter = require('./routes/cart.router');

app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/cart', initializeCart, cartRouter);
app.use('/admin', checkAdmin, adminRouter);

let User = require('./models/user.model');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },  
  function(username, password, done) {
    //console.log(`Received ${username} and ${password} from the form`)
    User.findOne({ email: username }, function (err, user) {
        //console.log(user)
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!(user.authenticate(password))) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      //console.log('SHOULD BE AUTHED')
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

const flash = require('connect-flash');
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.post('/login',
   passport.authenticate('local'),
   function(req, res) {
     // If this function gets called, authentication was successful.
     req.session.loggedIn = true
     req.session.user = req.user
     res.json({loggedIn: true, user: req.user})
   });



//Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});