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

//users/search?field=name&q=Moustafa
//users/search?field=email&q=Moustafa@gmail.com
router.get("/search",function (request, response) {
    switch (request.query.field) {
        case "name":
            mongoose.model("users").find({$text: {$search: request.query.q}},function (err, users) {
                if(!err)
                {
                    response.json(users);
                }
                else {
                    response.status(400).json({error: err});
                }
            });
            break;
        case "email":
            mongoose.model("users").find({email: request.params.q}, function (err, users) {
                if(!err)
                {
                    response.json(users);
                }
                else {
                    response.status(400).json({error: err});
                }
            });
            break;
    }
    //response.status(400).json({error: "Nothing Found"});
});

module.exports = router;