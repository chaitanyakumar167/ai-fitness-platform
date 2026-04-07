const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (Format is "Bearer <token_string>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user's ID to the request object so the next function can use it
      req.user = decoded.id;

      // Token is valid! Let them pass to the AI controller
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };