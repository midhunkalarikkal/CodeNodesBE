const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : String,
        required : true,
    },
    toUserId : {
        type : String,
        required : true,
    },
    status : {
        type : String,
        enum : {
            values : ["ignore","interested","accepted","rejected"],
            message : "{VALUES} is incorrect status type."
        }
    }
},{ timestamp : true});

module.exports = mongoose.model("ConnectionRequestModel",connectionRequestSchema);