//SCHEMA ---------------------------------------------------->

const mongoose = require("mongoose");

const user = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("books", book)     //inside bracket we are putting reference.
//without bracket we are targetting functions.