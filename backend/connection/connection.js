const mongoose = require("mongoose");

const connection = async (url) => {
    try {
        await mongoose.connect(url);
        console.log("Connected to database");
    } catch (error) {
        console.log(error);
    }
};

module.exports = connection;
