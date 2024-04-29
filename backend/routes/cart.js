const router = require('express').Router();
const User = require('../models/user')
const authMiddleware = require('../routes/userAuth')

// Route to add a book to the cart
router.put("/add-to-cart", authMiddleware(), async (req, res) => {
    try {
        const {_id} = req.user;
        const { bookid } = req.body;
        // Finding user data by id
        const userData = await User.findById(_id);

        // Checking if the book is already in the user's cart
        const isBookinCart = userData.cart.includes(bookid);

        if (isBookinCart) {
            // If book is already in cart, return message
            return res.json({
                status: "Success",
                message: "Book is already in cart"
            });
        } else {
            // If book is not in cart, add it to the cart
            await User.findByIdAndUpdate(_id, {
                $push: { cart: bookid }
            });

            return res.json({
                status: "Success",
                message: "Book added to cart"
            });
        }
    } catch (error) {
        // If any error occurs, log it and return an error response
        console.log(error);
        return res.status(500).json({ message: "An error occurred: ",error });
    }
});

// Route to remove a book from the cart
router.put("/remove-from-cart/:bookid", authMiddleware(), async (req, res) => {
    try {
        const { bookid } = req.params; // Extracting bookid from route parameters
        const { id } = req.headers; // Extracting id from request headers

        await User.findByIdAndUpdate(id, {
            $pull: { cart: bookid } // Pulling the bookid from the cart array
        });

        return res.json({
            status: "Success",
            message: "Book removed from cart"
        });
    } catch (error) {
        // If any error occurs, log it and return an error response
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router;
