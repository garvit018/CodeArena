import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/rankings", async (req, res) => {
  try {
    const rankings = await User.find()
      .sort({ points: -1 })
      .select("username country points problemsSolved tier")
      .limit(10);

    res.json(rankings);
  } catch (err) {
    console.error("Error fetching rankings:", err);
    res.status(500).send("Server Error");
  }
});

router.get("/profile", async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select(
      "username country points problemsSolved tier"
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).send("Server Error");
  }
});

router.post("/update", async (req, res) => {
  const { pointsEarned, problemsSolved } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    user.points += pointsEarned;
    user.problemsSolved += problemsSolved;
    user.updateTier();

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Server Error");
  }
});

export default router;
