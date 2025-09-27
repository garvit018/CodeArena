// Imports
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Import models and route handlers
const User = require('../models/User');
const Problems = require('../models/Problem');
const ACTIONS = require('./Actions');
const { signup, login } = require('../routes/auth');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
// CORS middleware for Express
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['https://codearena-o64w.onrender.com', 'http://localhost:3000'];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Enable cookies and authorization headers
  })
);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access Denied');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    req.user = user;
    next();
  });
};

// Route Handlers
app.use('/auth/signup', signup);
app.use('/auth/login', login);

// User Details
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');

    res.json({
      username: user.username,
      email: user.email,
      country: user.country || 'Unknown',
      points: user.points || 0,
      problemsSolved: user.problemsSolved || 0,
      tier: user.tier || 'Bronze',
      rating: user.rating || 0,
      institute: user.institute || 'Unknown',
      course: user.course || 'Unknown',
    });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).send('Server Error');
  }
});

// Rankings
app.get('/api/rankings', async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error fetching rankings:', err);
    res.status(500).send('Server Error');
  }
});

// Problems
app.get('/api/problems', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    
    // Find the user to get their solved problems
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find all problems
    const problems = await Problems.find();
    if (!problems || problems.length === 0) {
      return res.status(404).send('No problems found');
    }

    res.json({
      problems: problems.map((problem) => ({
        id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        order: problem.order,
        // Check if this problem is in the user's solved problems list
        solved: user.solvedProblems.some(
          solvedProblemId => solvedProblemId.toString() === problem._id.toString()
        ) ? 'Yes' : 'No',
        points: problem.points,
      })),
    });
  } catch (err) {
    console.error('Error fetching problems data:', err);
    res.status(500).send('Server Error');
  }
});

// Problem Details
app.get('/api/problems/:id', authenticateToken, async (req, res) => {
  try {
    const problem = await Problems.findById(req.params.id);

    if (!problem) {
      return res.status(404).send('Problem not found');
    }

    res.json({
      id: problem._id,
      title: problem.title,
      difficulty: problem.difficulty,
      category: problem.category,
      order: problem.order,
      description: problem.description,
      examples: problem.examples || [],
      constraints: problem.constraints || [],
      solved: problem.solved || 'No',
      points: problem.points,
    });
  } catch (err) {
    console.error('Error fetching problem details:', err);
    res.status(500).send('Server Error');
  }
});

// User Stats
app.get('/api/user/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      points: user.points,
      tier: user.calculateTier(), // Ensure tier calculation is dynamic
      problemsSolved: user.problemsSolved,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Solve Problem
app.patch('/api/problems/:problemId/solve', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { problemId } = req.params;

    const user = await User.findById(userId);
    const problem = await Problems.findById(problemId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (!problem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Problem not found' 
      });
    }

    // Check if problem already solved
    if (user.solvedProblems.some(solvedId => solvedId.toString() === problemId)) {
      return res.status(400).json({
        success: false,
        message: 'Problem already solved by this user'
      });
    }

    // Update user stats
    user.problemsSolved += 1;
    user.points += problem.points;
    user.solvedProblems.push(problemId);

    // Calculate tier
    const oldTier = user.tier;
    user.tier = user.calculateTier();

    // Save user
    await user.save();

    // Optional: Log the solve event
    console.log(`User ${user.username} solved problem ${problem.title}`);

    res.status(200).json({
      success: true,
      message: 'Problem marked as solved',
      pointsAwarded: problem.points,
      newTotalPoints: user.points,
      oldTier,
      newTier: user.tier,
    });
  } catch (error) {
    console.error('Error marking problem as solved:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to mark problem as solved',
      error: error.message 
    });
  }
});

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));
}

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

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

  socket.on('disconnecting', () => {
    [...socket.rooms].forEach((roomId) => {
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
