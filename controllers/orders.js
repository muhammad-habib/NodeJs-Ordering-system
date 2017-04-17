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
    //console.log("q :", request.query.field);
    //var array = string.split(',');
    switch (request.query.field) {
        case "owner":
            mongoose.model("orders").find({owner: new ObjectId(request.query.owner)}).limit(10).populate("owner").exec(function (err, orders) {
                if (err) {
                    response.json({error: "Not found"});
                    //console.log("error in list orders");
                } else {
                    response.json(orders);
                    //console.log("orders :", orders);
                }
            });
            break;
        case "owners":

            if (request.query.owners != "") {
                //console.log(request.query.owners.split(','));
                var ids = request.query.owners.split(',');
                mongoose.model("orders").find({
                    owner: {
                        $in: ids.map(function (id) {
                            return mongoose.Types.ObjectId(id);
                        })
                    }
                }).sort({date:-1}).limit(3).populate("owner").exec(function (err, orders) {
                    if (err) {
                        response.json({error: "Not found"});
                        //console.log("error in list orders");
                    } else {
                        response.json(orders);
                        //console.log("orders :", orders);
                    }
                });
            }

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
    } else {
        var order = new OrderModel({
            order_for: order_for,
            restaurant_name: restaurant_name,
            photo: photo,
            owner: request.body.owner,
            invited: request.body.invited
        });
        order.save(function (err) {
            if (!err) {
                mongoose.model("users").findById(request.body.owner, function (erro, owner) {
                            if (!erro) {
                                           for (var i = request.body.invited.length - 1; i >= 0; i--) {
                                                mongoose.model("users").findById(request.body.invited[i], function (err, reciver) {
                                                    if (!err) {
                                                        reciver.notifications.push({body:owner.name+" added You to order", type:"order_invitation" ,order_id: order._id});
                                                        reciver.unreaded_count++;

                                                        reciver.save(function (error) {
                                                            if (!error)
                                                            {
                                                             if(usersSockets[reciver._id])
                                                                {
                                                                    var userObj = {};
                                                                    userObj['name'] = owner.name;
                                                                    userObj['body'] = owner.name+" added You to order";
                                                                    userObj['avatar'] = owner.avatar;
                                                                    console.log(reciver.name +": "+reciver._id);
                                                                    usersSockets[reciver._id].emit("message",{notification: userObj,user: owner,type:"order_invitation",order_id: order._id});
                                                                }
                                                            }

                                                        });
                                                     }else{
                                                            console.log("error  in reciver");
                                                        }
                                                });
                                            }
                                            response.json(order);
                             }else{
                                console.log("error  in owner");
                             }
                });
            } else {
                response.status(400).json({error: "Insert Failed."});
            }
        });
    }
});




router.get("/:order", function (request, response) {
    mongoose.model("orders").findOne({_id: request.params.order}).deepPopulate('owner meals.owner invited').exec(function (err, order) {
        if (err) {
            response.status(400).json({error: err});
        } else {
            response.json(order);
        }
    })
});

router.post("/:order/meals/", function (request, response) {
    mongoose.model("orders").update(
        {"_id": request.params.order},
        {"$push": {"meals": request.body}},
        function (err, numAffected) {
            if (err) {
                response.status(400).json({error: err});
            } else {
                response.json(request.body);
            }
        }
    );
});

router.delete("/:order/meals/:meal", function (request, response) {
    mongoose.model("orders").update({_id: request.params.order}, {$pull: {meals: {_id: request.params.meal}}}, function (err, numAffected) {
        if (err) {
            response.status(400).json({error: err});
        } else {
            response.json(request.params);
        }
    });
});

router.delete("/:order/users/:user", function (request, response) {
    mongoose.model("orders").findById(request.params.order, function (err, order) {
        if (!err) {
            if (helpers.isInArray(request.params.user, order.invited)) {

                for (var i = 0; i < order.invited.length; i++) {
                    if (order.invited[i].toString() == request.params.user) {
                        order.invited.splice(i, 1);
                    }
                }

                var j = order.meals.length;
                while (j--) {
                    if (order.meals[j].owner.toString() == request.params.user) {
                        order.meals.splice(j, 1);
                    }
                }

                order.save(function (error) {
                    if (error) {
                        response.json({error: "error in handeling your request"});
                    } else {
                        response.json(order);
                    }
                });
            }
            else {
                response.json({error: "You are already deleted"});
            }
        }
    })
});

router.get("/:id/friends", function (request, response) {
    var friendsArr = [];
    var friendsOrdersArr = [];
    //get friends
    mongoose.model("users").find({_id: new ObjectId(request.params.id)}, {
        _id: 0,
        following: 1
    }).populate("following").exec(function (err, friends) {
        //console.log("prams", request.params);
        if (err) {
            response.json({error: "Not found"});
            //console.log("error in list friends");
        }
        else {


        }
    })
});
module.exports = router;
