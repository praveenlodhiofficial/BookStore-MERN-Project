//SCHEMA ---------------------------------------------------->

const mongoose = require("mongoose");

const user = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "books",
    },
    status: {
        type: String,
        default: "Order PLaced",
        enum: ["order Placed", "Out for Delivery, Delivered, Cancelled"],
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("order", order)     //inside bracket we are putting reference.
//without bracket we are targetting functions.
