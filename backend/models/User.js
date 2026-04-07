const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  metrics: {
    heightCm: { type: Number },
    weightKg: { type: Number },
    primaryGoal: { type: String }
  },

  // NEW: We are adding buckets to hold the generated JSON data
  savedDietPlan: { type: Object, default: null },
  savedWorkoutPlan: { type: Object, default: null }
  
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);