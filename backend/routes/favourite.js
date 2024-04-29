const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// Add book to favorites
router.put("/add-book-to-favorite", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.body; // Extract bookid from request body
        const { id } = req.user; // Extract user id from authenticated user

        // Find the user by id
        const userData = await User.findById(id);

        // Check if the book is already in favorites
        const isBookFavorite = userData.favorites.includes(bookid);
        if (isBookFavorite) {
            return res.status(200).json({ message: "Book is already in favorites" });
        }

        // Add the book to favorites
        await User.findByIdAndUpdate(id, { $push: { favorites: bookid } });

        return res.status(200).json({ message: "Book added to favorites" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;
