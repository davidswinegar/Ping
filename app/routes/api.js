var mongoose = require('mongoose');
var messageExports = require('../model/message');
var userExports = require('../model/user');
var express = require('express');
// maximum number of messages returned
var MAX_MESSAGES_RETURNED = 10;

// Gets the messages and send a response. If parameters are out of bounds, it will
// return 400. If params are not specified, it will use default start = 0 and size = 1.
// Returns the most recent messages specified by the start number.
exports.get_messages = function(req, res){
    var friend_ids = [];
    req.session.user.friends.forEach(function(item){
        friend_ids.push(item.id);
    });
    friend_ids.push(req.session.user._id);
    var start = 0;
    var length = 1;
    if(req.query.start) {
        var id = parseInt(req.query.start, 10);
        if(isNaN(id) || id < 0) {
            return res.send(400);
        }
        start = id;
    }
    if(req.query.size) {
        var size = parseInt(req.query.size, 10);
        if(isNaN(size) || size > MAX_MESSAGES_RETURNED || req.query.size <= 0) {
            // size is too large or not large enough
            return res.send(400);
        }
        length = size;
    }
    var query = messageExports.Message.find(
        {
            "user._id": {
                    $in : friend_ids
                }
        }).sort({dateAdded : 'desc'})
        .limit(length)
        .skip(start);

    query.exec(function(err, messages) {
        if(err){
            return res.send(404);
        }
        return res.json(messages);
    });
};

// Stores a new message. Returns the message stored to the client if it is successfully
// stored.
exports.post_message = function(req, res){
    var newMessage = new messageExports.Message({
        message : req.body.message,
        dateAdded : Date.now(),
        user : {
            _id : req.session.user._id,
            username : req.session.user.username
        }
    });
    console.log(req.body.message);
    newMessage.save(function(err) {
        if(err) {
            return res.send(400);
        }
        console.log(newMessage);
        return res.send(201, newMessage);
    });
};

// Gets the currently authenticated user from session. Includes friends and username,
// but not the password hash.
exports.get_authenticated_user = function(req, res){
    return res.json(200, req.session.user);
};

// Puts a new friend into a user's friends. Does not add the friend if it already
// exists in friends, returns error if the friend is not a valid username, a
// username is not specified, or the username is that of the current user.
// Returns the friend if successful.
exports.put_users_friends = function(req, res){
    // friend username exists and is not the current user
    if(!req.body.username || req.body.username === req.session.user.username) {
        return res.send(400);
    }
    // user doesn't already have friend
    req.session.user.friends.forEach(function(item) {
        if(item.username === req.body.username) {
            return res.json(302);
        }
    });

    var findUser = userExports.User.findOne({ username : req.body.username});
    findUser.exec(function(err, user) {
        if(err || user === null) {
            return res.send(404);
        }

        var friend = {
            username : user.username,
            id : user._id
        };

        var update = userExports.User.findByIdAndUpdate(req.session.user._id, {
            $addToSet : {friends : friend}
        });
        update.exec(function (err) {
            if(err) {
                  return res.send(500);
            }
            friend.id = friend.id.toHexString();
            req.session.user.friends.push(friend);
            return res.json(200, friend);
        });

    });
};