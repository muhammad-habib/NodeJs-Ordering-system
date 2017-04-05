var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var groups = new Schema({
    name: {type: String, required: true},
    owner: {type: String, required: true},
    members: [{type: Schema.ObjectId, ref: "users"}]
})

mongoose.model("groups", groups);
