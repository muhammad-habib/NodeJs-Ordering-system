var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var bodyParser = require("body-parser");
var helpers = require("../util/helpers");

var validator = require("validator");
var jwt = require('jsonwebtoken');
var config = require('../config');

router.get('/add',function (request, response) {
    mongoose.model("users").findById(request.query.from, function (err, user) {

        if (!err) {
            if (helpers.isInArray(request.query.to, user.following)) {
                response.json({error: "user  already in your followings"});
            }
            else {
                user.following.push(request.query.to);
                user.save(function (error) {
                    if (error)
                        response.json({error: "error in handeling your request"});
                    response.json(user);
                    mongoose.model("users").findById(request.query.to, function (err, follower) {
                        follower.notifications.push( user.name+" Follow You")
                        follower.save(function (error) {
                            if(error)
                                response.json({error: "error in handeling your request"});
                            console.log(follower);
                        })
                    });

                    if(usersSockets[request.query.to])
                    {
                        usersSockets[request.query.to].emit("message",{notification: user.name+" Follow You" });
                    }
                });
            }
        }

    })
});

router.get('/delete', function (request, response) {
    mongoose.model("users").findById(request.query.from, function (err, user) {
        if (!err) {
            if (helpers.isInArray(request.query.to, user.following)) {
                var deletedUser = '';
                user.following = helpers.removeItem(user.following, request.query.to);
                user.save(function (error) {
                    if (error)
                        response.json({error: "error in handeling your request"});
                    response.json(user);
                });
            }
            else {
                response.json({error: "You are already Un Following"});
            }
        }

    })
});

router.get('/list', function (request, response) {
    mongoose.model("users").findById(request.query.user_id, {following: 1}).populate('following').exec(function (err, following) {
        if (err)
            response.json({error: "Not found"});
        else if (following.following.length == 1 && following.following[0] == null) {
            following.following.pop();
            following.save();
            response.json(following.following);
        }
        else {
            response.json(following.following);
        }
    })
});

router.get("/search", function (request, response) {
    switch (request.query.field) {
        case "name":
            mongoose.model("users").findById(request.query.user_id, {following: 1}).populate({ path: 'following',match: {$text: {$search: request.query.q}}}).exec(function (err, users) {
                if (err) {
                    response.status(400).json({error: err});
                } else {
                    response.json((users) ? users.following : []);
                }
            });
            break;
    }
});

module.exports = router;
