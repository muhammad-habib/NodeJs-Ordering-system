var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var bodyParser = require("body-parser");
var helpers = require("../util/helpers");
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

router.get("/",function(request,response){
  console.log("list members");


  mongoose.model("groups").findOne({name:request.params.name},{_id:0, members: 1}).populate("members").exec(function (err, members) {
    console.log("prams",request.params);
           if (err){
              response.json({error: "Not found"});
              console.log("error in list members");
            }
          // else if(following.following.length == 1 &&  following.following[0] == null ) {
          //     following.following.pop();
          //     following.save();
          //     response.json(following.following);
          // }
          // else {
          //     response.json(following.following);
          // }

           else {
               response.json(members);
               console.log("members :",members);
           }
  })


});


router.get("/members/add",function(request,response){
  console.log("add member");
  console.log("query :",request.query);
  mongoose.model("groups").find({name:request.query.name}, function (err, group) {
    console.log(group);
      if (!err)
      {
          if (helpers.isInArray(request.query.uid,group[0].members))
          {
              response.json({error: "user  already in your followings"});
          }
          else
          {
              group.members.push(request.query.uid);
              group.save(function(error) {
                  if (error)
                      response.json({error: "error in handeling your request"});
                  response.json(group);
                  console.log(group);
              });
          }
      }

  })


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
