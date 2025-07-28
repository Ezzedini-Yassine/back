const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // Refresh
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(403).json({ message: 'No refresh token' });

      try {
        const { newAccessToken, newRefreshToken } = await userService.refreshToken(refreshToken, jwt.decode(token).userId);
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.setHeader('New-Access-Token', newAccessToken); // Send new access in header
        req.user = jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SECRET);
        next(); // Proceed with new token
      } catch (refreshErr) {
        res.clearCookie('refreshToken');
        return res.status(403).json({ message: refreshErr.message });
      }
    } else {
      return res.status(403).json({ message: 'Invalid token' });
    }
  }
};

module.exports = authMiddleware;