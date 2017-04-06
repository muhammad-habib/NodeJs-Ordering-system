var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var bodyParser = require("body-parser");

var validator = require("validator");
var jwt = require('jsonwebtoken');


router.get("/list",function (request, response) {
    response.send("list");
});




router.get('/:term',function (request, response) {
    mongoose.model("users").find({email: request.params.term}, function (err, user) {
        if(!err)
        {
            response.json(user);
        }
        else {
            response.json({error: "Not found"});
        }
    });
});

module.exports = router;