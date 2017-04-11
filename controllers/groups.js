var express = require("express");
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;//by seif
var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var bodyParser = require("body-parser");
var helpers = require("../util/helpers");
var validator = require("validator");
var jwt = require('jsonwebtoken');

router.get("/members/add", function (request, response) {
    console.log("add member");
    console.log("query :", request.query);
    mongoose.model("groups").find({name: request.query.name}, function (err, group) {
        console.log(group);
        if (!err) {
            if (helpers.isInArray(request.query.uid, group[0].members)) {
                response.json({error: "user  already in your followings"});
            }
            else {
                group[0].members.push(request.query.uid);
                group[0].save(function (error) {
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
    console.log("body", request.body);
    var groupModel = mongoose.model("groups");

    var group = new groupModel({
        name: request.body.name,
        owner: request.body.owner
    });

    group.save(function (err) {
        if (!err) {
            response.json(group);
            console.log("add group sucess");
        } else {
            response.send(err);
            response.status(400).json({error: "adding Failed"});
        }
    });
});

router.get("/search", function (request, response) {
    switch (request.query.field) {
        case "name":
            mongoose.model("groups").find({
                owner: request.query.user_id,
                $text: {$search: request.query.q}
            }).populate('members').exec(function (err, groups) {
                if (err) {
                    response.status(400).json({error: err});
                } else {
                    response.json(groups);
                }
            });
        break;
    }
});


router.get("/:id/list", function (request, response) {
    console.log("list groups by user");
    console.log("prams", request.params);
    mongoose.model("groups").find({owner: new ObjectId(request.params.id)}, function (err, groups) {
        console.log("result groups :", groups);
        if (!err) {
            response.json(groups);
        }
        else {
            response.status(400).json({error: err});
        }
    });
    //response.json({g1:{name:"OS",id:2},g2:{name:"java",id:3}});

});

router.get("/:name/members", function (request, response) {
    console.log("list members");
    mongoose.model("groups").findOne({name: request.params.name}, {
        _id: 0,
        members: 1
    }).populate("members").exec(function (err, members) {
        console.log("prams", request.params);
        if (err) {
            response.json({error: "Not found"});
            console.log("error in list members");
        } else {
            response.json(members);
            console.log("members :", members);
        }
    })

    // mongoose.model("groups").findOne({name:request.params.name},{_id:0, members: 1}).populate("members").exec(function (err, members) {
    //   console.log("prams",request.params);
    //          if (err){
    //             response.json({error: "Not found"});
    //             console.log("error in list members");
    //           }
    //
    //          else {
    //              response.json(members);
    //              console.log("members :",members);
    //          }
    // })


});

module.exports = router;
