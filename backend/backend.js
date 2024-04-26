require('dotenv').config();
const express = require('express');
const app = express();
require("dotenv").config();
require("./connection/connection");
const user = require("./routes/user");
const mongoConnect = require('../backend/connection/connection')

app.use(express.json());
// routes
app.use("/api/v1", user); // Corrected from User to user

mongoConnect(process.env.URI).then(async () => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening at http://localhost:${process.env.PORT}`);
    });
  }).catch((err) => {
    console.error(err);
  });