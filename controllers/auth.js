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
            if (!err && user[0].password === sha256(password)) {
                response.json(
                    {
                        id: user[0].id,
                        name: user[0].name,
                        email: user[0].email,
                        token: 'fake-jwt-token'
                    }
                );
            }
            else {
                response.status(400).json({status: "Invalid email or password."});
            }
        })
    }
});

router.post("/register",bodyParser.urlencoded({extended: false}) ,function (request, response) {
console.log(request.body);
    var UserModel = mongoose.model("users");

    UserModel.find({email: request.body.email},function (err,users) {
        if (users.length) {
            response.status(400).json({error:"Email already in use."});
        }else{
            var user = new UserModel({
                name: request.body.name,
                email: request.body.email,
                password: sha256(request.body.password),
            });

            user.save(function (err) {
                if (!err) {
                    response.json({"status" : "done"})
                } else {
                    response.status(400).json({error:"Registeration Failed"});
                }
            });
        }
    });

});


module.exports = router;