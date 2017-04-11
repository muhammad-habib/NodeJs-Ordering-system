var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var groups = new Schema({
    name: String,
    owner: {type: Schema.ObjectId, ref: "users"},
    members: [{type: Schema.ObjectId, ref: "users"}]
})

groups.index({name: 'text'});

mongoose.model("groups", groups);
