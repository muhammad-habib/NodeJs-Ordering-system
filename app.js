var express = require('express');
var expressServer = express();

 config = require('./config');

var http = require('http');
var httpSERVER = http.createServer(expressServer);
io = require('socket.io')(httpSERVER);
usersSockets = {};
var bodyParser = require("body-parser");

var fs = require("fs");

var passport = require("passport");

var expressJwt = require('express-jwt');

var mongoose = require("mongoose");
mongoose.connect("mongodb://iti:iti_os_37@ds155160.mlab.com:55160/iti_orders");

var port = process.env.PORT || 8080;


//mongoose.connect("mongodb://localhost:27017/nodejs_project");

var authRouter = require("./controllers/auth");
var usersRouter = require("./controllers/users");
var followRouter = require("./controllers/follow");
var groupsRouter = require("./controllers/groups");
var notificationsRouter = require("./controllers/notifications");
var uploadRouter = require("./controllers/upload");
var ordersRouter = require("./controllers/orders");

fs.readdirSync(__dirname + "/models").forEach(function (file) {
    require("./models/" + file);
});


 //i.collection.drop(function (err) { cb(); });

expressServer.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'x-access-token,content-type,Accept,Authorization,Origin,X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');    
    next();
});

expressServer.use(express.static('public'));


// expressServer.use(expressJwt({secret: config.APP_SECRET}).unless({
//     path: [
//         '/auth/login',
//         '/auth/register',
//         '/auth/facebook',
//         '/auth/facebook/callback',
//         '/home',
//         '/upload/photo',
//         /\/follow\/\w*/ig,
//         '/notification/list',
//         '/users/list',
//         /\/groups\/\w*/ig,
//     ]
// }));


io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        delete usersSockets[socket.clientId];
    });

    socket.on('add-message', function (obj) {
        io.emit('message', {type: 'new-message', text: obj});
    });

    socket.on('login-message', function (obj) {
        socket.clientId = obj.user_id;
        usersSockets[obj.user_id] = socket;
      //  console.log(Object.keys(usersSockets).length);
    });

    socket.on('logout-message', function (obj) {
        delete usersSockets[socket.clientId];
    })

    //by seif: send to my followers
    socket.on('toMyFollowers', function (obj) {
      //console.log("soket: ",obj)
      console.log("all sokets: ",usersSockets);
      var arr=obj.ids.split(",")
      if(obj.ids!=""){console.log("true");

      if(usersSockets[arr[i]]){
        for(i=0;i<arr.length;i++){
          console.log("loop id :",arr[i])
          usersSockets[arr[i]].emit("newOrder",{bool:true})
        }

      }
    }

    })
    //console.log(Object.keys(usersSockets).length);
});




expressServer.use(bodyParser.urlencoded({extended: false}));
expressServer.use(bodyParser.json());
expressServer.use(passport.initialize());
expressServer.use(passport.session());
expressServer.use("/auth", authRouter);
expressServer.use("/users", usersRouter);
expressServer.use("/follow", followRouter);
expressServer.use("/groups", groupsRouter);
expressServer.use("/notification", notificationsRouter);
expressServer.use("/upload", uploadRouter);
expressServer.use("/orders", ordersRouter);

httpSERVER.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
