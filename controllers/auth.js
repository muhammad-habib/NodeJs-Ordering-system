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
    if (!validator.isEmail(email)|| validator.isEmpty(email) || validator.isEmpty(password)) {
        response.json({status: "Wrong Data"});
    } else {
        mongoose.model("users").find({email: email}, {password: true , access_token: true}, function (err, user) {
            if (!err && sha256(password)== user[0].password) {
                response.json({status: "login successfully", access_token: user[0].access_token });
            }
            else {
                response.json({status: "login failed"});
            }
        })

    }
});

router.post("/register",bodyParser.urlencoded({extended: false}) ,function (request, response) {

    var UserModel = mongoose.model("users");
    
  var name=request.body.name;
    var email=request.body.email;
    var password=request.body.password;
    var access_token=sha256(name+new Date()+Math.random());
    var errors=[];

    if(validator.isEmpty(name) || validator.isEmpty(email) ||validator.isEmpty(password)){
        errors.push("Please Fill All The Fields");
    }

    if(!validator.isEmail(email)){
      errors.push("Invalid Email");
    }

    if(errors.length>0){
      response.json({status: "registeration failed" , errors:errors});
    }    

    else{
     
    var user = new UserModel({
        name: name,
        email: email,
        password: sha256(password),
        access_token: access_token
    });

    user.save(function (err) {
        if (!err) {
            response.json(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    access_token: user.access_token
                }
            );
        } else {
            response.json({status: "registeration failed"});
        }
    });
    }
});


module.exports = router;