const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../routes/userAuth')

// Sign-Up Page
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Check username length is more than 4
        if (username.length < 4) {
            return res.status(400).json({
                message: "Username's Length should be greater than 3",
            });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already Exists" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already Exists" });
        }

        // Check password length is more than 7
        if (password.length < 8) {
            return res.status(400).json({ message: "Password's Length should be greater than 7." });
        }

        const hashPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address,
        });

        await newUser.save();       // 'isActive()' Save the new user to the database
        return res.status(200).json({ message: "Sign-Up Successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// Sign-In Page
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // await bcrypt.compare(password, existingUser.password, (err, data) => {
        //     if (data) {
        //         const authClaims = [
        //             { name: existingUser.username },
        //             { role: existingUser.role },
        //         ];
        //         const token = jwt.sign({ authClaims }, "bookstore123", {
        //             expiresIn: "30d",
        //         });
        //         res.status(200).json({ id: existingUser._id, role: existingUser.role, token: token });
        //     } else {
        //         return res.status(400).json({ message: "Invalid credentials" });
        //     }
        // });
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (isMatch) {
            const secretKey = process.env.JWT_SECRET_KEY || 'bookstore123';
            const token = jwt.sign({ _id: existingUser.id }, secretKey);

            return res.status(200).json({
                id: existingUser._id,
                message: "Login successful",
                token,
            });
        } else {
            return res.status(404).json({ error: "Invalid Credentials!!!" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//get-user-information
router.get("/get-user-information", authMiddleware(), async (req, res) => {
    try {
      const { id } = req.headers;
      const data = await User.findById(id).select('-passwor  d');
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error getting user information:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // update address
  router.put("/update-address", authMiddleware(), async (req, res) => {
    try {
        const userId = req.headers.id; // Extract user ID from headers

        if (!userId) {
            return res.status(400).json({ message: "User ID not provided in headers" });
        }

        const { address } = req.body;

        if (!address) {
            return res.status(400).json({ message: "Address is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { address: address }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Address updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;




//post - data bhejna hai

// if status(200) - No Error
// if status(400) - Error from user side
// if status(500) - Error from Backend