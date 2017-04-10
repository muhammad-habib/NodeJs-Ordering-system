var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orders = new Schema({
    order_for: {type: String, required: true},
    restaurant_name: {type: String, required: true},
    date: {type: Date, default: Date.now},
    photo: {type: String, required: true},
    invited: [{type: Schema.ObjectId, ref: "users"}],
    meals: [{
      items:[{name:String, amount:Number , price:Number,comment:String}] ,
      owner: {type: Schema.ObjectId, ref: "users"}
    }],
    owner: {type: Schema.ObjectId, ref: "users"}
});

mongoose.model("orders", orders);
