var express = require("express");
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;//by seif
//var forEach = require('async-foreach').forEach;//by seif
var config = require('../config');
var mongoose = require("mongoose");
var helpers = require("../util/helpers");//by seif
var bodyParser = require("body-parser");//by seif
var validator = require("validator");

var multer = require('multer');

router.get("/", function (request, response) {
    console.log("q :",request.query);
    //var array = string.split(',');
    switch (request.query.field) {
        case "owner":
            mongoose.model("orders").find({owner: new ObjectId(request.query.owner)}).limit(10).populate("owner").exec(function (err, orders) {
                if (err) {
                    response.json({error: "Not found"});
                    console.log("error in list orders");
                } else {
                    response.json(orders);
                    console.log("orders :", orders);
                }
            });
            break;
    }
});

router.post("/", function (request, response) {

    var OrderModel = mongoose.model("orders");

    var order_for = validator.escape(request.body.order_for);
    var restaurant_name = validator.escape(request.body.restaurant_name);
    var photo = validator.escape(request.body.photo);

    if (validator.isEmpty(order_for) || validator.isEmpty(restaurant_name) || validator.isEmpty(photo)) {
        response.status(400).json({error: "Please Fill All The Fields"});
    }else{
        var order = new OrderModel({
            order_for: order_for,
            restaurant_name: restaurant_name,
            photo: photo,
            owner : request.body.owner,
            invited : request.body.invited,
        });

        order.save(function (err) {
            if (!err) {
                response.json(order)
            } else {
                response.status(400).json({error: "Insert Failed."});
            }
        });
    }

});

router.get("/:id", function (request, response) {

});

router.post("/:id/meals/", function (request, response) {

});

router.get("/:id/friends", function (request, response) {
  var friendsArr=[];
  var friendsOrdersArr=[];
  //get friends
  mongoose.model("users").find({_id:new ObjectId(request.params.id)},{_id:0, following: 1}).populate("following").exec(function (err, friends) {
    console.log("prams",request.params);
           if (err){
              response.json({error: "Not found"});
              console.log("error in list friends");
            }
            else {


           }
  })
});
module.exports = router;
