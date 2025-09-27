// routes/problemTable.js
const express = require('express');
const Problems = require('../models/Problem');  // Correct import

const router = express.Router();

// Define the route handler to fetch all problems
router.get('/', async (req, res) => {
  try {
    // Find all problems and select specific fields to return
    const problems = await Problems.find().select('id title difficulty category order');
    res.status(200).json({ data: problems });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

module.exports = router;  // Export the router for use in server.js
