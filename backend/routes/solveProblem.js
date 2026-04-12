import express from "express";
import { solveProblem } from "../controller/ProblemController.js";

const router = express.Router();

router.post("/:problemId/solve", solveProblem);

export default router;
