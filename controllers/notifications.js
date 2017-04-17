var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var bodyParser = require("body-parser");
var helpers = require("../util/helpers");
var validator = require("validator");
var jwt = require('jsonwebtoken');


router.get('/status',function (request, response) {

    mongoose.model("users").findById(request.query.user_id,function (err, user) {
        if (!err)
        {
        	user.read_notification = true;
            user.unreaded_count = 0;
        	user.save(function (error) {
                    if (error)
                        response.json({error: "error in handeling your request"});
                    response.json({mission:true});
                });
        }
    })
});


router.get('/list',function (request, response) {

    mongoose.model("users").findById(request.query.user_id,{notifications: 1,read_notification: 1, unreaded_count:1},function (err, notifications) {
        if (!err)
        {
            response.json(notifications);
        }
    })
});



module.exports = router;