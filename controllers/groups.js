var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var bodyParser = require("body-parser");

var validator = require("validator");
var jwt = require('jsonwebtoken');

router.get("/list", function(requset,response){
  console.log("list");
  mongoose.model("groups").find({}, function (err, groups) {
      if(!err)
      {
          response.json(groups);
      }
      else {
          response.status(400).json({error: err});
      }
  });
  //response.json({g1:{name:"OS",id:2},g2:{name:"java",id:3}});

});

router.post("/add", bodyParser.urlencoded({extended: false}), function (request, response) {
  console.log("body",request.body);
  var groupModel = mongoose.model("groups");

  var group = new groupModel({
      name: request.body.name,
      owner: request.body.owner

  });

  group.save(function (err) {
      if (!err) {
          response.json({"status": "done"})
      } else {
          response.send(err);
          response.status(400).json({error: "adding Failed"});
      }
  });


});

module.exports = router;
