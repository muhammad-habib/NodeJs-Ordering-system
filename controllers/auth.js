var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var bodyParser = require("body-parser");

var validator = require("validator");

function sha256(msg) {
    return crypto.createHash("sha256").update(msg).digest("base64");
}

router.post("/login", function (request, response) {
    var email = request.body.email;
    var password = request.body.password;
    if (!validator.isEmail(email) || validator.isEmpty(password)) {
        response.json({status: "Wrong Data"});
    } else {
        mongoose.model("users").find({email: email}, {password: true}, function (err, user) {
            if (!err && bcrypt.compareSync(password, user[0].password)) {
                response.json({status: "login successfully"});
            }
            else {
                response.json({status: "login failed"});
            }
        })

    }
});

router.post("/register",bodyParser.urlencoded({extended: false}) ,function (request, response) {
console.log(request.body);
    var UserModel = mongoose.model("users");

    var user = new UserModel({
        name: request.body.name,
        email: request.body.email,
        password: sha256(request.body.password),
    });

    user.save(function (err) {
        if (!err) {
            response.json(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: 'fake-jwt-token'
                }
            );
        } else {
            response.json({status: "registeration failed"});
        }
    });
});


module.exports = router;