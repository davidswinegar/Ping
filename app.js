// dependencies
var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var https = require('https');
var path = require('path');
var routes = require('./app/routes');
var partials = require('./app/routes/partials');
var api_routes = require('./app/routes/api');
var auth = require('./app/routes/auth');
var secureInfo = require('./secure_untracked_info')
var passport = auth.passport;

var app = express();

// Connect to mongodb
mongoose.connect('localhost', 'ping');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to DB');
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('ssl_port', process.env.SSLPORT || 4000);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');
app.use(auth.redirectSecure(app.get('ssl_port')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: secureInfo.secretCookiePhrase, cookie : { secure : true } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Verb endpoints
// authentication
app.post('/login', auth.postLogin);
app.post('/register', auth.postRegister);
app.get('/logout', auth.logout);

// unauthenticated static pages
app.get('/login', auth.ensureNotAuthenticated, routes.login);
app.get('/register', auth.ensureNotAuthenticated, routes.registerAcc);

// authenticated static pages/partial pages
app.get('/', auth.ensureAuthenticated, routes.index);
app.get('/main', auth.ensureAuthenticated, partials.main);
// authenticated API endpoints
var API_PREFIX = '/api/v1';
app.all(API_PREFIX + '/*', auth.ensureAuthenticated, auth.verify_user_session);
app.get(API_PREFIX + '/pings/subscribed', api_routes.get_messages);
app.post(API_PREFIX + '/pings', api_routes.post_message);
app.get(API_PREFIX + '/users/current', api_routes.get_authenticated_user);
app.put(API_PREFIX + '/users/current', api_routes.put_users_friends);

// Server creation
var https_server = https.createServer(secureInfo.credentials, app);
var http_server = http.createServer(app);

http_server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

https_server.listen(app.get('ssl_port'), function(){
    console.log('HTTPS server listening on port ' + app.get('ssl_port'));
});