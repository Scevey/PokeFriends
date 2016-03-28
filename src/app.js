//import libraries 
var path = require('path'); //path is a built-in node library to handle file system paths
var express = require('express'); //express is a popular Model-View-Controller framework for Node
var compression = require('compression'); //compression library to gzip responses for smaller/faster transfer
var favicon = require('serve-favicon'); //favicon library to handle favicon requests
var cookieParser = require('cookie-parser'); //Library to parse cookies from the requests
var bodyParser = require('body-parser'); //library to handle POST requests any information sent in an HTTP body
var mongoose = require('mongoose'); //Mongoose is one of the most popular MongoDB libraries for node
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');
var csrf = require('csurf');
var dbURL = process.env.MONGOLAB_URI || "mongodb://localhost/PokeFriendApp";
//In MVC, you have 'routes' that line up URLs to controller methods
var db = mongoose.connect(dbURL, function(err) {
    if(err) {
        console.log("Could not connect to database");
        throw err;
    }
});
var redisURL = {
	hostname: 'localhost',
	port: 6379
};
var redisPass;

if(process.env.REDISCLOUD_URL){
	redisURL = url.parse(process.env.REDISCLOUD_URL);
	redisPass = redisURL.auth.split(":")[1];
}
var router = require('./router.js');

//Port set by process.env.PORT environment variable.
//If the process.env.PORT variable or the env.NODE_PORT variables do not exist, use port 3000    
var port = process.env.PORT || process.env.NODE_PORT || 3000;

//call express to get an Express MVC server object
var app = express();

app.use('/assets', express.static(path.resolve(__dirname+'/../client/')));

//Call compression and tell the app to use it
app.use(compression());

// parse form POST requests as application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:true }));

// parse application/json body requests. These are usually POST requests or requests with a body parameter in AJAX
//Alternatively, this might be a web API request from a mobile app, another server or another application
app.use(bodyParser.json());

//app.set sets one of the express config options
//set up the view (V of MVC) to use jade (not shown in this example but needed for express to work)
//You can use other view engines besides jade
app.use(session({
	key: "sessionid",
	store: new RedisStore({
		host: redisURL.hostname,
		port: redisURL.port,
		pass: redisPass
	}),
	secret: 'Domo Arigato',
	resave: true,
	saveUninitialized: true,
	cookie:{
		httpOnly: true
	}
}));
app.set('view engine', 'jade');

//set the views path to the template directory (not shown in this example but needed for express to work)
app.set('views', __dirname + '/views');

//call favicon with the favicon path and tell the app to use it
app.use(favicon(__dirname + '/../client/img/ball.png'));
app.disable('x-powered-by');
//call the cookie parser library and tell express to use it
app.use(cookieParser());
app.use(csrf());
app.use(function(err,req,res,next){
	if(err.cod !== 'EBADCSRFTOKEN') return next(err);
		
	return;
});
//pass our app to our router object to map the routes
router(app);

//Tell the app to listen on the specified port
var server = app.listen(port, function(err) {
    //if the app fails, throw the err 
    if (err) {
      throw err;
    }
    console.log('Listening on port ' + port);
});

