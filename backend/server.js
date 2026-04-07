const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import our new AI controller
const { generateDietPlan,generateWorkoutPlan } = require('./controllers/aiController');
const { registerUser , loginUser } = require('./controllers/authController');
const { protect } = require('./middleware/authMiddleware');
const { savePlan, getUserDashboard } = require('./controllers/userController');

const app = express();

app.use(cors());
app.use(express.json()); 

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- ROUTES ---

// Our previous test route
app.get('/api/test-user', (req, res) => {
  res.json({ message: "Backend is successfully connected!" });
});


// Auth Routes
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
// --------------

// NEW: The AI Diet Generation Route
// We use POST because the frontend will be sending us a "body" of data (height, weight, etc.)

// AI Routes
app.post('/api/generate-diet', protect, generateDietPlan);
app.post('/api/generate-workout', protect, generateWorkoutPlan);

// NEW: User Dashboard & Data Routes
app.get('/api/user/dashboard', protect, getUserDashboard); // Uses GET to fetch data
app.post('/api/user/save-plan', protect, savePlan);        // Uses POST to send data

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});