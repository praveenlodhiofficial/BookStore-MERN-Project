const express = require('express');
const app = express();
require("dotenv").config();
require("../backend/connection/connection");
const User = require("../backend/routes/user");
const mongoConnect = require('../backend/connection/connection')
const Books = require('../backend/routes/book')

app.use(express.json());
// routes
app.use("/api/v1", User); // Corrected from User to user
app.use("/api/v1", Books); // Corrected from User to user

mongoConnect(process.env.URI).then(async () => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening at http://localhost:${process.env.PORT}`);
    });
  }).catch((err) => {
    console.error(err);
  });