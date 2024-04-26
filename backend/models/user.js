//SCHEMA ---------------------------------------------------->

const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],               //enum here used to switch between user & admin
    },
    favourites: [
        {
            type: mongoose.Types.ObjectId,
            ref: "books",
        }
    ],
    cart: [
        {
            type: mongoose.Types.ObjectId,
            ref: "books",
        }
    ],
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref: "order",
        }
    ],
},
    {
        timestamps: true
    }
);
module.exports = mongoose.model("user", user)