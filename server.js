'use strict';

// =================================================================
// get the packages we need ========================================
// =================================================================
var express 	= require('express');
var app         = express();
var swig        = require('swig');
var favicon     = require('serve-favicon');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var cors        = require('cors');
var passport    = require('passport');
var flash       = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var MongoStore = require('connect-mongo')(session);

require('dotenv').load();

// passport auth 
require('./server/services/passport')(passport);

// get our config file
var config = require('./config');


// =================================================================
// get the routes' files ===========================================
// =================================================================
var renderRoutes = require('./server/routes/render-routes')
var apiRoutes = require('./server/routes/api-routes')(passport);

// =================================================================
// configuration ===================================================
// =================================================================

// templating options
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');
//app.set('view cache', false);

//************ in dev only ************
app.set('view cache', false);
swig.setDefaults({ cache: false });
//************ in dev only ************

// static files
app.use(favicon(__dirname + '/public/assets/favicon.ico'));
app.use(express.static(__dirname + '/public'));

// port
var port = process.env.PORT || 3001;


// connect to database
mongoose.connect(config.database); 
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
mongoose.connection.on('connected', function() {
  console.log('MongoDB Connection Successfull, ' + mongoose.connection.host);
});

// use body parser so we can get info from POST and/or URL parameters
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true , limit: '5mb'}));
app.use(bodyParser.json());
app.use(session({
    secret: '38r892*$%UJRBVCB&8t78e98fu98fh29qu',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    proxy: true,
    resave: false,
    saveUninitialized: false
})); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// cors set up
app.use(cors());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'origin, x-requested-with, content-type, accept, x-xsrf-token', 'Token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);
  
    // Request headers you wish to expose
    res.setHeader('Access-Control-Expose-Headers', 'sessionToken, expiresIn');

    next();
});

// disable 'powered by'
app.disable('x-powered-by');

// use morgan to log requests to the console
app.use(morgan('dev'));

// =================================================================
// routes ==========================================================
// =================================================================

app.use('/api', apiRoutes);
app.use('/', renderRoutes);


// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at port ' + port);
