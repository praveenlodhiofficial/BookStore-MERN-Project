const router = require("express").Router();
const authMiddleware = require('../routes/userAuth')
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user"); // Import User model

// Place order
router.post("/place-order", authMiddleware(), async (req, res) => {
  try {
    const { _id } = req.user; // Assuming user ID is obtained from authentication middleware
    const { order } = req.body;

    for (const orderData of order) {
      const newOrder = new Order({ user: _id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();

      // Saving Order in user model
      await User.findByIdAndUpdate(_id, { $push: { orders: orderDataFromDb._id } });

      // Clearing cart
      await User.findByIdAndUpdate(_id, { $pull: { cart: orderData._id } });
    }

    return res.json({
      status: "Success",
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get order history of a particular user
router.get("/get-order-history", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.user; // Assuming user ID is obtained from authentication middleware

    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    const ordersData = userData.orders.reverse();

    return res.json({
      status: "Success",
      data: ordersData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get all orders (for admin)
router.get("/get-all-orders", authMiddleware(), async (req, res) => {
  try {
    const userData = await Order.find()
      .populate("book")
      .populate("user")
      .sort({ createdAt: -1 });

    return res.json({
      status: "Success",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Update order status (for admin)
router.put("/update-status/:id", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });
    return res.json({
      status: "Success",
      message: "Status Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
