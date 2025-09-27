const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all rankings (sorted by points, for global ranking)
router.get('/rankings', async (req, res) => {
  try {
    const rankings = await User.find()
      .sort({ points: -1 }) // Sort by points in descending order
      .select('username country points problemsSolved tier')
      .limit(10); // Limit to top 10 users for example

    res.json(rankings);
  } catch (err) {
    console.error("Error fetching rankings:", err);
    res.status(500).send("Server Error");
  }
});

// Fetch user details
router.get('/profile', async (req, res) => {
  const userId = req.user.id; // Assuming JWT token for authentication

  try {
    const user = await User.findById(userId).select('username country points problemsSolved tier');
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).send("Server Error");
  }
});

// Update points after solving a problem
router.post('/update', async (req, res) => {
  const { pointsEarned, problemsSolved } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    user.points += pointsEarned;
    user.problemsSolved += problemsSolved;
    user.updateTier(); // Update the tier based on points

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
