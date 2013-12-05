// Credits to passport-local example for most of this:
// https://github.com/jaredhanson/passport-local/blame/master/examples/express3-mongoose/app.js

var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var SALT_WORK_FACTOR = 10;

// Validators
var usernameValidator = function (username) {
    return username.length > 0 && username.length < 30;
};
var usernameValid = [usernameValidator, 'Invalid username'];

// Friend Schema (subdocument inside user)
var friendSchema = mongoose.Schema({
    id : {type : mongoose.Schema.Types.ObjectId, required:true},
    username : { type: String, required:true, validate : usernameValid }
}, {autoIndex : false, _id : false});


// User Schema
var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, validate : usernameValid },
    password: { type: String, required: true },
    friends : [friendSchema]
});

// Bcrypt middleware
userSchema.pre('save', function(next) {
    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

exports.userSchema = userSchema;
exports.User = mongoose.model('User', userSchema);
exports.FriendSchea = friendSchema;
exports.Friend = mongoose.model('Friend', userSchema);