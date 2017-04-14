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
                else
                {
                    user.following.push(request.query.to);
                    user.save(function (error) {
                    if (error){
                        response.json({error: "error in handeling your request"});
                    }
                    else{
                        mongoose.model("users").findById(request.query.to, function (err, reciver) {
                            if (!err) {
                                reciver.notifications.push({body:user.name+" follow You", type:"friend"});
                                reciver.save(function (error) {
                                    if (!err)
                                    {
                                        console.log(reciver);
                                        response.json(user);
                                    }

                                });
                             }else{
                                response.json({error: "error in handeling your request"});
                             }
                        });
                        if(usersSockets[request.query.to])
                        {
                            var userObj = {};
                            userObj['name'] = user.name;
                            userObj['body'] = user.name+" Follow You";
                            userObj['avatar'] = user.avatar;
                            usersSockets[request.query.to].emit("message",{notification: userObj,user: user,type:"friend"});
                        }
                    }
                    });
                }
            }
            else
            {
                response.json({error: "error in handeling your request"});
            }
    });
});


router.get('/delete', function (request, response) {
    mongoose.model("users").findById(request.query.from, function (err, user) {
        if (!err) {
            if (helpers.isInArray(request.query.to, user.following)) {
                var deletedUser = '';
                user.following = helpers.removeItem(user.following, request.query.to);
                user.save(function (error) {
                    if (error){
                        response.json({error: "error in handeling your request"});
                    }else{
                        response.json(user);
                    }
                });
            }
            else {
                response.json({error: "You are already Un Following"});
            }
        }

    })
});




router.get('/block', function (request, response) {
    mongoose.model("users").findById(request.query.from, function (err, user) {
        if (!err) {
            if (!helpers.isInArray(request.query.to, user.blocking)) {
                user.blocking.push(request.query.to);
                user.following = helpers.removeItem(user.following, request.query.to);
                user.save(function (error) {
                    if (error)
                    {
                        response.json({error: "error in handeling your request"});
                    }
                    else{
                        mongoose.model("users").findById(request.query.to, function (err, follower) {
                            if (!err) {
                                console.log("bef arr");
                                if (helpers.isInArray(request.query.from, follower.following)) {
                                    console.log("in arr");
                                     follower.following = helpers.removeItem(follower.following, request.query.from);
                                     follower.save(function (error) {
                                        if (error)
                                        {
                                             console.log("err");
                                            response.json({error: "error in handeling your request"});
                                        }
                                        else{
                                            console.log("yes");

                                            response.json(follower);
                                        }
                                    });
                                 }
                             }else{
                                response.json({error: "error in handeling your request"});
                             }
                        });
                    }
                });
            }
            else {
                response.json({error: "user are already blocking list"});
            }
        }
        else
        {
            response.json({error: "error in handeling your request"});
        }

    })
});



router.get('/unblock', function (request, response) {
    mongoose.model("users").findById(request.query.from, function (err, user) {
        if (!err) {
            if (helpers.isInArray(request.query.to, user.blocking)) {
                console.log(request.query.to);
                user.blocking = helpers.removeItem(user.blocking, request.query.to);
                user.save(function (error) {
                    if (error)
                    {
                        response.json({error: "error in handeling your request"});
                    }
                    else{
                        response.json(user);
                    }


                });
            }
            else {
                response.json({error: "user are already Un blocked"});
            }
        }
        else
        {
            response.json({error: "error in handeling your request"});
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


router.get('/list/block', function (request, response) {
    mongoose.model("users").findById(request.query.user_id, {blocking: 1}).populate('blocking').exec(function (err, blocking) {
        if (err)
            response.json({error: "Not found"});
        else if (blocking.blocking.length == 1 && blocking.blocking[0] == null) {
            blocking.blocking.pop();
            blocking.save();
            response.json(blocking.blocking);
        }
        else {
            response.json(blocking.blocking);
        }
    });
});



router.get('/list/followers', function (request, response) {

    mongoose.model("users").findById(request.query.user_id, {blocking: 1}).populate('blocking').exec(function (err, blocking) {
        if (err)
            response.json({error: "Not found"});
        else {
            mongoose.model("users").find({following:request.query.user_id}, function (err, users) {
                if (!err) {

                    for (var i = 0; i < blocking.blocking.length; i++) {
                        users = helpers.removeItem(users, blocking.blocking[i]);
                    }
                    //console.log(users);
                    response.json(users);
                }
                else{
                    response.status(400).json({error: err});
                }
            });
        }
    });
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
