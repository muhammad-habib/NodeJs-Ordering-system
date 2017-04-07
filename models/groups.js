var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var groups = new Schema({
    name: String,
    owner: String,
    members: [{type: Schema.ObjectId, ref: "users"}]
});

mongoose.model("groups", groups);
