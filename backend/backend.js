const express = require('express');
const app = express();
require("dotenv").config();
require("../backend/connection/connection");
const User = require("../backend/routes/user");
const mongoConnect = require('../backend/connection/connection')
const Books = require('../backend/routes/book')
const Favourite = require('../backend/routes/favourite');
const Cart = require('../backend/routes/cart');
const Order = require('../backend/routes/order');

app.use(express.json());
// routes
app.use("/api/v1", User); 
app.use("/api/v1", Books); 
app.use("/api/v1", Favourite); 
app.use("/api/v1", Cart); 
app.use("/api/v1", Order); 

mongoConnect(process.env.URI).then(async () => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening at http://localhost:${process.env.PORT}`);
    });
  }).catch((err) => {
    console.error(err);
  });