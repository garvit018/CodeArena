import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import User from "../models/User.js";

export const solveProblem = async (req, res) => {
  const { userId, problemId } = req.body;

  try {
    const problem = await Problem.findOne({ id: problemId });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.solved === "Yes") {
      return res.status(400).json({ message: "Problem already solved" });
    }

    problem.solved = "Yes";
    await problem.save();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let pointsToAdd = 0;
    switch (problem.difficulty) {
      case "Easy":
        pointsToAdd = 100;
        break;
      case "Medium":
        pointsToAdd = 300;
        break;
      case "Hard":
        pointsToAdd = 500;
        break;
      default:
        pointsToAdd = 0;
    }

    user.points += pointsToAdd;
    user.tier = user.calculateTier();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Problem marked as solved",
      pointsAwarded: pointsToAdd,
      user,
    });
  } catch (error) {
    console.error("Error solving problem:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
