import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User.js";
import Problems from "../models/Problem.js";
import { ACTIONS } from "./Actions.js";
import { signup, login } from "../routes/auth.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "https://code-arena-inky.vercel.app,http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json());

app.get("/ping", (req, res) => {
  res.status(200).send("Pong");
});

// ✅ CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// ✅ MongoDB connect + Auto-seed Problems
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("Connected to MongoDB ✅");

    const seedProblems = [
      {
        id: "two-sum",
        title: "Two Sum",
        difficulty: "Easy",
        category: "Array",
        order: 1,
        description: "Find two numbers such that they add up to a target.",
        examples: ["Input: nums=[2,7,11,15], target=9", "Output: [0,1]"],
        constraints: ["Only one valid answer exists."],
        points: 10,
        testCases: [
          { input: "4\n2 7 11 15\n9", output: "0 1" },
          { input: "3\n3 2 4\n6", output: "1 2" },
        ],
      },
      {
        id: "longest-substring",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        category: "String",
        order: 2,
        description:
          "Find the length of the longest substring without repeating characters.",
        examples: ["Input: s='abcabcbb'", "Output: 3"],
        constraints: ["1 <= s.length <= 5 * 10^4"],
        points: 20,
        testCases: [
          { input: "abcabcbb", output: "3" },
          { input: "bbbbb", output: "1" },
          { input: "pwwkew", output: "3" },
        ],
      },
      {
        id: "median-two-arrays",
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        category: "Array",
        order: 3,
        description: "Find the median of two sorted arrays.",
        examples: ["Input: nums1=[1,3], nums2=[2]", "Output: 2.0"],
        constraints: [
          "The overall run time complexity should be O(log (m+n)).",
        ],
        points: 30,
        testCases: [
          { input: "2\n1 3\n1\n2", output: "2" },
          { input: "2\n1 2\n2\n3 4", output: "2.5" },
        ],
      },
    ];

    for (const problem of seedProblems) {
      await Problems.updateOne(
        { id: problem.id },
        { $set: problem },
        { upsert: true },
      );
    }

    console.log("Problems seeded/updated with test cases ✅");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

// ✅ JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
};

// ✅ Auth routes
app.post("/auth/signup", signup);
app.post("/auth/login", login);

// ✅ Get logged-in user
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send("User not found");

    res.json({
      username: user.username,
      email: user.email,
      country: user.country || "Unknown",
      points: user.points || 0,
      problemsSolved: user.problemsSolved || 0,
      tier: user.tier || "Bronze",
      rating: user.rating || 0,
      institute: user.institute || "Unknown",
      course: user.course || "Unknown",
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// ✅ Rankings
app.get("/api/rankings", async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// ✅ All problems
app.get("/api/problems", async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader?.split(" ")[1];
    let user = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
      } catch (err) {
        // Invalid token, ignore
      }
    }

    const problems = await Problems.find();
    if (!problems || problems.length === 0)
      return res.status(404).send("No problems found");

    res.json({
      problems: problems.map((problem) => ({
        id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        order: problem.order,
        solved:
          user &&
          user.solvedProblems?.some(
            (solvedProblemId) =>
              solvedProblemId.toString() === problem._id.toString(),
          )
            ? "Yes"
            : "No",
        points: problem.points,
      })),
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// ✅ Problem by ID
app.get("/api/problems/:id", authenticateToken, async (req, res) => {
  try {
    const problem = await Problems.findById(req.params.id);
    const user = await User.findById(req.user.id).select("solvedProblems");
    if (!problem) return res.status(404).send("Problem not found");

    const isSolvedByUser = Boolean(
      user?.solvedProblems?.some(
        (solvedProblemId) =>
          solvedProblemId.toString() === problem._id.toString(),
      ),
    );

    res.json({
      id: problem._id,
      title: problem.title,
      difficulty: problem.difficulty,
      category: problem.category,
      order: problem.order,
      description: problem.description,
      examples: problem.examples || [],
      constraints: problem.constraints || [],
      testCases: problem.testCases || [],
      solved: isSolvedByUser ? "Yes" : "No",
      points: problem.points,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// ✅ User stats
app.get("/api/user/stats", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      points: user.points,
      tier: user.calculateTier(),
      problemsSolved: user.problemsSolved,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Mark problem solved
app.patch(
  "/api/problems/:problemId/solve",
  authenticateToken,
  async (req, res) => {
    try {
      const { id: userId } = req.user;
      const { problemId } = req.params;

      const user = await User.findById(userId);
      const problem = await Problems.findById(problemId);

      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      if (!problem)
        return res
          .status(404)
          .json({ success: false, message: "Problem not found" });

      if (
        user.solvedProblems.some(
          (solvedId) => solvedId.toString() === problemId,
        )
      )
        return res
          .status(400)
          .json({ success: false, message: "Problem already solved" });

      user.problemsSolved += 1;
      user.points += problem.points;
      user.solvedProblems.push(problemId);
      const oldTier = user.tier;
      user.tier = user.calculateTier();
      await user.save();

      res.status(200).json({
        success: true,
        message: "Problem marked as solved",
        pointsAwarded: problem.points,
        newTotalPoints: user.points,
        oldTier,
        newTier: user.tier,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to mark problem as solved",
        error: error.message,
      });
    }
  },
);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://code-arena-inky.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    }),
  );
}

io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    if (!roomId || !username) return;
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    io.to(roomId).emit(ACTIONS.JOINED, {
      clients,
      username,
      socketId: socket.id,
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    [...socket.rooms].forEach((roomId) => {
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
