const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER A NEW USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user in MongoDB
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create a JWT Token so they can log in immediately
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};


// 2. LOGIN AN EXISTING USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      // We use a generic message for security so hackers don't know if an email exists
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // 2. Compare the plain text password with the hashed password in MongoDB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. If passwords match, create a new JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};


module.exports = { registerUser, loginUser };

