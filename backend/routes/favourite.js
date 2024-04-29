const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// Add book to favourites
router.put("/add-book-to-favourites", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.body; // Extract bookid from request body
        const { id } = req.user; // Extract user id from authenticated user

        // Find the user by id
        const userData = await User.findById(id);

        // Check if the book is already in favourites
        const isBookFavourite = userData.favourites.includes(bookid);
        if (isBookFavourite) {
            return res.status(200).json({ message: "Book is already in favourites" });
        }

        // Add the book to favourites
        await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });

        return res.status(200).json({ message: "Book added to favourites" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Remove book from favourites
router.put("/remove-book-from-favourite", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.body; // Assuming bookid is sent in the request body
        const { id } = req.user; // Assuming id is stored in the user object after authentication

        const userData = await User.findById(id);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const isBookFavourite = userData.favourites.includes(bookid);

        if (!isBookFavourite) {
            return res.status(400).json({ message: "Book is not in favourites" });
        }

        await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });

        return res.status(200).json({ message: "Book removed from favourites" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get favourite books of a particular user
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
    try {
        const { id } = req.user; // Extract user id from authenticated user

        // Find the user by id and populate their favourite books
        const userData = await User.findById(id).populate("favourites");

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const favouriteBooks = userData.favourites;

        return res.json({
            status: "Success",
            data: favouriteBooks,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router;
