var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var orders = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Boolean, default: false},
    avatar: String,
    invited: [{type: Schema.ObjectId, ref: "users"}],
    meals: [{
      items:[{name:String, amount:Number , price:Number,comment:String}] ,
      owner: {type: Schema.ObjectId, ref: "users"}
    }],
    owner: {type: Schema.ObjectId, ref: "users"}
})

mongoose.model("orders", orders);
