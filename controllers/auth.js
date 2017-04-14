var express = require("express");
var router = express.Router();
var config = require('../config');//by seif
// var fbConfig = require('../configs/fb');

var mongoose = require("mongoose");
var crypto = require('crypto'), shasum = crypto.createHash('sha1');

var validator = require("validator");
var jwt = require('jsonwebtoken');

var multer = require('multer');

// var passport = require("passport");
// var FacebookStrategy = require("passport-facebook").Strategy;

function sha256(msg) {
    return crypto.createHash("sha256").update(msg).digest("base64");
}


// passport.use(new FacebookStrategy({
//   clientID        : fbConfig.appID,
//   clientSecret    : fbConfig.appSecret,
//   callbackURL     : fbConfig.callbackUrl,
//   profileFields: ['id', 'displayName', 'photos', 'email']
// },
//   function(access_token, refresh_token, profile, done) {

//     process.nextTick(function() {

//       mongoose.model("users").findOne({ 'id' : profile.id }, function(err, user) {
 
//         if (err)
//           return done(err);

//           if (user) {
//             return done(null, user);
//           } else {

//             var UserModel = mongoose.model("users");
//             var newUser = new UserModel()
//             newUser.id    = profile.id;              
//             newUser.access_token = access_token;                     
//             newUser.name  = profile.displayName;
//             newUser.password ='123456';
//             newUser.email = profile.emails[0].value;
            
//             newUser.save(function(err) {
//               if (err)
//                 throw err;

//               return done(null, newUser);
//             });
//          }
//       });
//     });
// }));


// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });


router.post("/login", function (request, response) {
    var email = validator.escape(request.body.email);
    var password = request.body.password;

    if (!validator.isEmail(email) || validator.isEmpty(email) || validator.isEmpty(password)) {
        response.status(400).json({error: "Wrong Data."});
    } else {
        mongoose.model("users").findOne({email: email}, function (err, user) {
            if (!err && user && sha256(password) === user.password) {
                var userData = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: jwt.sign({ sub: user._id }, config.APP_SECRET)

                };
                response.json(userData);
            }
            else {
                response.status(400).json({error: "Invalid email or password."});
            }
        })
    }
});

router.post("/register", function (request, response) {

    var UserModel = mongoose.model("users");

    var name = validator.escape(request.body.name);
    var email = validator.escape(request.body.email);
    var password = request.body.password;

    if (validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(password)) {
        response.status(400).json({error: "Please Fill All The Fields"});
    }else{
        UserModel.findOne({email: request.body.email}, function (err, user) {
            if (user) {
                response.status(400).json({error: "Email already in use."});
            } else {
                var user = new UserModel({
                    name: name,
                    email: email,
                    avatar: request.body.avatar,
                    password: sha256(password)
                });

                user.save(function (err) {
                    if (!err) {
                        response.json({"status": "done"})
                    } else {
                        response.status(400).json({error: "Registeration Failed"});
                    }
                });
            }
        });
    }

});

router.post("/facebook",function(request,response){
  console.log(request.body)
  var UserModel = mongoose.model("users");
  var fb_id = request.body.facebookID;
  var name = request.body.name;
  var email = request.body.email;
  var avatar = request.body.avatar;
 
  UserModel.findOne({email: email}, function (err, user) {
       
    if (user) 
        {   

          user.facebookID = fb_id;

          user.save(function(err){
            if (!err) {
                var userData = {
                    _id: user._id,
                    facebookID : user.facebookID,
                    name: user.name,
                    email: user.email,
                    avatar : user.avatar,
                    token: jwt.sign({ sub: user._id }, config.APP_SECRET)

                };
                console.log("user logged using fb") ; 
                response.json(userData);
            }
          })
        }
    else{
           var user = new UserModel({
                        facebookID : fb_id,
                        name: name,
                        email: email,
                        avatar: avatar,
                        password: 'facebook_user'
                         });

            user.save(function (err) {
                if (!err) {
                  var userData = {
                     _id: user._id,
                     facebookID : user.facebookID,
                     name: user.name,
                     email: user.email,
                     avatar : user.avatar,
                     token: jwt.sign({ sub: user._id }, config.APP_SECRET)

                          };
                     console.log("new fb") ;
                     console.log(userData) ;
                  response.json(userData);
               } else {
               response.status(400).json({error: "Registeration Failed"});
                      }
            });            
             
      }
 });
});
// router.get("/facebook",
//   passport.authenticate('facebook')
// );


// router.get('/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect : '/home',
//     failureRedirect : '/auth/login'
//   })

// );


module.exports = router;
//mongo ds155160.mlab.com:55160/iti_orders -u iti -p iti_os_37
