var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var bodyParser = require("body-parser");
var helpers = require("../util/helpers");
var validator = require("validator");
var jwt = require('jsonwebtoken');


router.get('/list',function (request, response) {

    mongoose.model("users").findById(request.query.user_id,{notifications: 1},function (err, notifications) {
        if (!err)
        {
            console.log(notifications);
            response.json(notifications);
        }
    })
});

module.exports = router;