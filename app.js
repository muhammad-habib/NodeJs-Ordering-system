var express = require('express');
var expressServer=express();
var http=require('http');
var httpSERVER=http.createServer(expressServer);
var io=require('socket.io')(httpSERVER);
var session=require("express-session");
var authRouter = require("./controllers/auth");
var mongoose=require("mongoose");
var fs=require("fs");
var sessionMiddleware=session({
  secret:"#@$@#%$^&",
  });

mongoose.connect("mongodb://localhost:27017/nodejs_project");

fs.readdirSync(__dirname+"/models").forEach(function(file){
  require("./models/"+file);
})

io.on("connection",function(socketClient){
	});
 
 expressServer.use(express.static('public'));
 expressServer.use("/auth",authRouter);
 expressServer.use(sessionMiddleware);

 



httpSERVER.listen(8090);