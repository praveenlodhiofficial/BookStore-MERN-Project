const router = require("express").Router();
const User = require("../models/user")
const jwt = require("jsonwebtoken");
const Book = require("../models/book"); // Assuming you have a Book model defined
const { authenticateToken } = require("./userAuth");

// Add book --admin
router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res
                .status(400)
                .json({ message: "You do not have access to perform Admin work." });
        }

        // Create a new Book instance based on the data received in the request body
        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            description: req.body.description,
            language: req.body.language
        });

        // Save the book to the database
        await book.save();

        // Return a success message
        res.status(200).json({ message: "Book added successfully" });
    } catch (error) {
        // If there's an error, return an internal server error status
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//update book
router.put("/update-book/:bookid", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.params; // Use req.params to get bookid
        const { url, title, author, price, desc, language } = req.body; // Destructure req.body

        const updatedBook = await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            description: req.body.description,
            language: req.body.language,
        }, { new: true }); // Use { new: true } to return the updated document

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({
            message: "Book updated successfully!",
            book: updatedBook // Return the updated book
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// Delete Book Route
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers; // Assuming you're passing bookid in headers

        // Find the book by ID and delete it
        await Book.findByIdAndDelete(bookid);

        // Respond with a success message if deletion is successful
        return res.status(200).json({
            message: "Book deleted successfully!",
        });
    } catch (error) {
        // If an error occurs, handle it here
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// Get All Books Route
router.get("/get-all-books", async (req, res) => {
    try {
        // Retrieve all books from the database, sorted by creation date in descending order
        const books = await Book.find().sort({ createdAt: -1 });

        // Respond with the retrieved books
        return res.json({
            status: "Success",
            data: books,
        });
    } catch (error) {
        // If an error occurs during the process, handle it here
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// Get Recently Added Books Route (limit 4)
router.get("/get-recent-books", async (req, res) => {
    try {
        // Find the 4 most recently added books, sorted by creation date in ascending order
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);

        // Respond with the retrieved books
        return res.json({
            status: "Success",
            data: books,
        });
    } catch (error) {
        // If an error occurs during the process, handle it here
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// Get Book by ID Route
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract the book ID from request parameters

        // Find the book by its ID
        const book = await Book.findById(id);

        // If the book is not found, return a 404 status
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Respond with the retrieved book
        return res.json({
            status: "Success",
            data: book,
        });
    } catch (error) {
        // If an error occurs during the process, handle it here
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router;