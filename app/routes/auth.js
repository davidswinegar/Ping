// Passport setup credits to passport-local:
// https://github.com/jaredhanson/passport-local/blame/master/examples/express3-mongoose/app.js
// Used/redistributed under the MIT license: http://opensource.org/licenses/MIT

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var userExports = require('../model/user');
var User = userExports.User;

// Redirects all traffic from http to https.
exports.redirectSecure = function(port) {
    return function(req, res, next) {
        if(!req.secure){
            if(port != 443){
                res.redirect('https://'+req.host+':'+port+req.originalUrl);
            } else {
                res.redirect('https://'+req.host+req.originalUrl);
            }
        } else {
            next();
        }
    };
};

// Authenticate user from post, store info in session
exports.postLogin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            req.session.messages =  [info.message];
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            req.session.user = user.toObject();
            // remove hashed password from session
            delete req.session.user.password;
            return res.redirect('/');
        });
    })(req, res, next);
};

// create a new user, redirect to login page
exports.postRegister = function(req, res, next) {
    var user = new User({
            username: req.body.username,
            password : req.body.password,
            friends : []
        });
    user.save(function(err) {
        if(err) {
            req.session.messages = err;
            return res.redirect('/register');
        } else {
            console.log('user: ' + user.username + " saved.");
        }
        res.redirect('/login');
    });
};

// log out, redirect to login.
exports.logout = function(req, res){
    req.logout();
    res.redirect('/login');
};

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
};

exports.ensureNotAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/');
};

// Verifies that user information is held in session.
exports.verify_user_session = function(req, res, next) {
    if( ! req.session.user ||
        ! req.session.user._id ||
        ! req.session.user.username ||
        ! req.session.user.friends) {
        req.logout();
        return res.send(501);
    }
    return next();
};

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new localStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);
            if(isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid password' });
            }
        });
    });
}));

exports.passport = passport;
