const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// SIGN UP
const signup = async (req, res) => {
  const { username, email, password, country, institute, course } = req.body;
  
  // Validate required fields
  if (!username || !email || !password || !country || !institute || !course) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance without manually setting tier
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      country,
      institute,
      course,
      points: 0,  // Default points value (tier will default to 'Bronze III')
      problemsSolved: 0,
      // Don't manually set the 'tier'
    });

    // Save the new user to the database
    await newUser.save();

    // Create a JWT token for the user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send success response with the token
    res.status(201).json({
      message: "User created successfully",
      token, // Send token back to the frontend
    });
  } catch (err) {
    console.error("Error during signup:", err); // Log the error
    res.status(500).json({ message: "Server error", error: err.message }); // Send detailed error message
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Make sure JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT Secret is not defined" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ data: token, message: "Logged in successfully" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

// Export functions
module.exports = { signup, login };
