const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    problemsSolved: {
      type: Number,
      default: 0,
    },
    tier: {
      type: String,
      enum: [
        'Platinum',
        'Gold I', 'Gold II', 'Gold III',
        'Silver I', 'Silver II', 'Silver III',
        'Bronze I', 'Bronze II', 'Bronze III',
      ],
      default: 'Bronze III',
    },
    institute: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    solvedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProblemDetails',
      },
    ],
  },
  { timestamps: true }
);

// Method to calculate tier
userSchema.methods.calculateTier = function () {
  if (this.points >= 5000) return 'Platinum';
  if (this.points >= 3000) return 'Gold I';
  if (this.points >= 2500) return 'Gold II';
  if (this.points >= 2000) return 'Gold III';
  if (this.points >= 1400) return 'Silver I';
  if (this.points >= 1000) return 'Silver II';
  if (this.points >= 800) return 'Silver III';
  if (this.points >= 600) return 'Bronze I';
  if (this.points >= 300) return 'Bronze II';
  return 'Bronze III'; // This is a valid enum value in the schema
};


// Middleware to update tier before saving
userSchema.pre('save', function (next) {
  this.tier = this.calculateTier();
  next();
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
