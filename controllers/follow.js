var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var bodyParser = require("body-parser");

var validator = require("validator");
var jwt = require('jsonwebtoken');
var config = require('../config');


router.get('/:id',function (request, response) {

    // verify a token symmetric - synchronous
    var decoded = jwt.verify(request.query.token, config.APP_SECRET);
    console.log(decoded); // bar
    // mongoose.model("users").findById(request.user._id, function (err, user) {
    //     if (!err)
    //     {
    //         user.friends.push(request.params.id);
    //         user.save(function(error) {
    //             if (error)
    //                 response.json({error: "Not found"});
    //             response.json(request.user);
    //         });
    //
    //     }
    //
    // })

    response.json(decoded.name);




});

module.exports = router;
