var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var bodyParser = require("body-parser");

var validator = require("validator");
var jwt = require('jsonwebtoken');

router.get("/list", function(requset,response){
  console.log("list");
  response.json({g1:{name:"OS",id:2},g2:{name:"java",id:3}});
});

module.exports = router;
