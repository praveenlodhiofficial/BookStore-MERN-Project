const router = require('express').Router();
const { authenticateToken } = require("./userAuth");
const User = require("./models/User"); // Assuming you have a User model defined

// Route to add a book to the cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
    try {
        // Extracting bookid and id from request headers
        const { bookid, id } = req.headers;
        
        // Finding user data by id
        const userData = await User.findById(id);

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
            await User.findByIdAndUpdate(id, {
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
        return res.status(500).json({ message: "An error occurred" });
    }
});

// Route to remove a book from the cart
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
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
