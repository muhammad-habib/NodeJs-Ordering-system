var express=require("express");
var router=express.Router();
var mongoose=require("mongoose");
var bcrypt=require("bcrypt");
var multer=require("multer");
var validator = require("validator");
var uploadFileMiddleware=multer({dest:__dirname+"/../public",
fileFilter:function(request,file,cb){
  if(file.mimetype=="image/jpeg"){
    request.fileStatus="file uploaded";
    cb(null,true);
  }else{
    request.fileStatus="file not uploaded";
    cb(null,false);
  }

}})


router.post("/login",uploadFileMiddleware.single("avatar"),function(request,response){
	var email= request.body.email;
	var password=request.body.password;
    if(!validator.isEmail(email) || validator.isEmpty(password)){
    response.json({status:"Wrong Data"});
  }else{
  	mongoose.model("users").find({email:email},{password:true},function(err,user){
  		if (!err && bcrypt.compareSync(password,user[0].password)){
  			response.json({status:"login successfully"});
  		}
  		else{
  			response.json({status:"login failed"});
  		}
  	})

  }
})

router.post("/register",uploadFileMiddleware.single("avatar"),function(request,response){
  
  var UserModel=mongoose.model("users");
  var salt=bcrypt.genSaltSync();
  var hashedPassword=bcrypt.hashSync(request.body.password,salt);
  var user = new UserModel({name:request.body.name,email:request.body.email,
  	password:hashedPassword,avatar:request.file.filename});

  user.save(function(err){
	if(!err){
		response.json({status:"registered successfully"});
	}
	else{
		response.json({status:"registeration failed"});
	}
	});
});


module.exports=router;