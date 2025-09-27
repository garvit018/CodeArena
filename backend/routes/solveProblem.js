const express = require('express');
const router = express.Router();
const { solveProblem } = require('../controller/ProblemController'); // Assuming your controller is in problemController.js

// Route to mark a problem as solved and update points
router.post('/solve', solveProblem);

module.exports = router;
