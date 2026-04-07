const User = require('../models/User');

// 1. SAVE A GENERATED PLAN TO THE USER'S PROFILE
const savePlan = async (req, res) => {
  try {
    const { type, planData } = req.body;
    
    // We get req.user from our "Bouncer" middleware we built earlier!
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Determine if we are saving a diet or a workout
    if (type === 'diet') {
      user.savedDietPlan = planData;
    } else if (type === 'workout') {
      user.savedWorkoutPlan = planData;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid plan type' });
    }

    await user.save();

    res.status(200).json({ success: true, message: `${type} plan saved successfully!` });

  } catch (error) {
    console.error("Save Plan Error:", error);
    res.status(500).json({ success: false, message: 'Failed to save plan' });
  }
};

// 2. FETCH THE USER'S DASHBOARD DATA
const getUserDashboard = async (req, res) => {
  try {
    // Find the user, but don't send the password back to the frontend!
    const user = await User.findById(req.user).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });

  } catch (error) {
    console.error("Fetch Dashboard Error:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch user data' });
  }
};

module.exports = { savePlan, getUserDashboard };