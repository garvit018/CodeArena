const mongoose = require('mongoose');

const Problem = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    difficulty: { type: String, required: true }, 
    category: { type: String, required: true },
    order: { type: Number, required: true },
    description: { type: String, required: true },
    examples: { type: [String], default: [] },
    constraints: { type: [String], default: [] },
    solved: { 
      type: String, 
      enum: ['Yes', 'No'], 
      default: 'No' 
    },
    points: { 
      type: Number, 
      default: function() {
        // Automatically set points based on difficulty
        switch(this.difficulty.toLowerCase()) {
          case 'easy': return 50;
          case 'medium': return 80;
          case 'hard': return 100;
          default: return 0;
        }
      }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProblemDetails', Problem);