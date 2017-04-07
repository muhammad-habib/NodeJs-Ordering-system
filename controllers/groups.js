var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var bodyParser = require("body-parser");

var validator = require("validator");
var jwt = require('jsonwebtoken');

router.get("/list", function(request,response){
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

router.get("/:name/members",function(request,response){
  console.log("list members");

  // mongoose.model("groups").find({name:request.params.name}.populate("users"), function (err, groups) {
  //     if(!err)
  //     {
  //         response.json(groups);
  //     }
  //     else {
  //         response.status(400).json({error: err});
  //     }
  // });

  mongoose.model("groups").find({name:request.params.name},{ _id:0,members: 1}).populate('users').exec(function (err, members) {
    console.log(members);
          // if (err)
          //     response.json({error: "Not found"});
          // else if(following.following.length == 1 &&  following.following[0] == null ) {
          //     following.following.pop();
          //     following.save();
          //     response.json(following.following);
          // }
          // else {
          //     response.json(following.following);
          // }
  })


});


router.get("/:name/members/add/:id",function(request,response){
  console.log("list members");

  mongoose.model("groups").update({name:request.params.name},{$push:{members:request.params.id}},{}, function (err, groups) {
      if(!err)
      {
          response.json({"status": "done"});
      }
      else {
          response.status(400).json({error: err});
      }
  });


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
