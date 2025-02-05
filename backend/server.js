require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken"); // No bcrypt required now

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// API: Get All Users (Email & Plain Passwords)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { email: 1, password: 1, _id: 0 }); // Fetch email and plain passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// API: Register User (No Hashing)
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = new User({ email, password }); // Storing plain password
    await newUser.save();
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

// API: Login User (Check Plain Password)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (password !== user.password)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// API: Delete User by Email
app.delete("/delete", async (req, res) => {
  const { email } = req.body; // Get email from request body
  try {
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: `User with email ${email} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
