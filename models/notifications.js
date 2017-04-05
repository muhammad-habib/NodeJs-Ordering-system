var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var notifications = new Schema({
    status: {type: String, required: true},
    orderId: [{type: Schema.ObjectId, ref: "orders"}]
})

mongoose.model("notifications", notifications);
