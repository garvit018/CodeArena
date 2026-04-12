import express from "express";
import Problems from "../models/Problem.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const problems = await Problems.find().select(
      "id title difficulty category order",
    );
    res.status(200).json({ problems });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

export default router;
