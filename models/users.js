var mongoose = require("mongoose")
var Schema = mongoose.Schema;


var users = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    online: {type: Boolean, default: false},
    avatar: String,
    access_token: String,
    following: [{type: Schema.ObjectId, ref: "users"}]
})

mongoose.model("users", users);