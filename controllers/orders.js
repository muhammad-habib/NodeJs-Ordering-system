var express = require("express");
var router = express.Router();

var config = require('../config');
var mongoose = require("mongoose");
var helpers = require("../util/helpers");//by seif
var bodyParser = require("body-parser");//by seif
var validator = require("validator");

var multer = require('multer');

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
//home component services
router.get("/:id", function (request, response) {
  mongoose.model("orders").find({owner:request.params.id}, function (err, orders) {
    console.log("result groups :", groups);
      if(!err)
      {
          response.json(groups);
      }
      else {
          response.status(400).json({error: err});
      }
  });

});
module.exports = router;
