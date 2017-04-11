var mongoose = require("mongoose")
var Schema = mongoose.Schema;


var users = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    online: {type: Boolean, default: false},
    avatar: String,
    notifications:[],
    read_notification:{type: Boolean, default: false},
    access_token: String,
    following: [{type: Schema.ObjectId, ref: "users"}]
});

users.index({name: 'text'});

mongoose.model("users", users);
