const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const User = require('../models/User');

// Function to mark a problem as solved and update points
const solveProblem = async (req, res) => {
  const { userId, problemId } = req.body; // Assuming these are passed in the request body

  try {
    // Find the problem by the 'id' field (not '_id')
    const problem = await Problem.findOne({ id: problemId }); // Use 'id' field here
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Check if the problem is already solved
    if (problem.solved === 'Yes') {
      return res.status(400).json({ message: 'Problem already solved' });
    }

    // Mark the problem as solved
    problem.solved = 'Yes';
    await problem.save();

    // Find the user and update their points
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Add points based on problem difficulty
    let pointsToAdd = 0;
    switch (problem.difficulty) {
      case 'Easy':
        pointsToAdd = 100;
        break;
      case 'Medium':
        pointsToAdd = 300;
        break;
      case 'Hard':
        pointsToAdd = 500;
        break;
      default:
        pointsToAdd = 0;
    }

    user.points += pointsToAdd;

    // Update the user's tier based on points
    user.tier = user.calculateTier(); // Recalculate tier
    await user.save(); // Save the updated user

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Problem marked as solved',
      pointsAwarded: pointsToAdd,
      user,
    });
  } catch (error) {
    console.error("Error solving problem:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { solveProblem };
