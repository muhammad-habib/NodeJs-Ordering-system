var express = require("express");
var router = express.Router();

var config = require('../config');

var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var bodyParser = require("body-parser");

var validator = require("validator");
var jwt = require('jsonwebtoken');

function sha256(msg) {
    return crypto.createHash("sha256").update(msg).digest("base64");
}

router.post("/login", function (request, response) {

    var email = request.body.email;
    var password = request.body.password;

    if (!validator.isEmail(email) || validator.isEmpty(email) || validator.isEmpty(password)) {
        response.status(400).json({error: "Wrong Data."});
    } else {
        mongoose.model("users").findOne({email: email}, function (err, user) {
            if (!err && user && sha256(password) === user.password) {
                var userData = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    token: jwt.sign({ sub: user._id }, config.APP_SECRET)
                };
                console.log(userData);
                response.json(userData);
            }
            else {
                response.status(400).json({error: "Invalid email or password."});
            }
        })
    }
});

router.post("/register", bodyParser.urlencoded({extended: false}), function (request, response) {

    var UserModel = mongoose.model("users");

    var name = request.body.name;
    var email = request.body.email;
    var password = request.body.password;

    if (validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(password)) {
        response.status(400).json({error: "Please Fill All The Fields"});
    }else{
        UserModel.find({email: request.body.email}, function (err, users) {
            if (users.length) {
                response.status(400).json({error: "Email already in use."});
            } else {
                var user = new UserModel({
                    name: request.body.name,
                    email: request.body.email,
                    password: sha256(request.body.password),
                });

                user.save(function (err) {
                    if (!err) {
                        response.json({"status": "done"})
                    } else {
                        response.status(400).json({error: "Registeration Failed"});
                    }
                });
            }
        });
    }

});

module.exports = router;