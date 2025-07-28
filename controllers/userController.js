const userService = require('../services/userService');
const createError = require('http-errors');

class UserController {
  async registerAdmin(req, res, next) {
    try {
      const user = await userService.registerAdmin(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error.message === 'User already exists') {
        return next(createError(409, 'User already exists'));
      }
      next(error);  // Added to propagate other errors
    }
  }

  async registerUser(req, res, next) {
    try {
      const user = await userService.registerUser(req.body);
      res.status(201).json({ message: 'User registered. Please check your email to confirm.', user });
    } catch (error) {
      if (error.message === 'User already exists') {
        return next(createError(409, 'User already exists'));
      }
      next(error);
    }
  }

  async confirmEmail(req, res, next) {
    try {
      const user = await userService.confirmEmail(req.params.token);
      res.status(200).json({ message: 'Email confirmed successfully', user });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { accessToken, refreshToken } = await userService.login(req.body);
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }

  async getUserStats(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    const stats = await userService.getUserStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}

async changePassword(req, res, next) {
  try {
    const result = await userService.changePassword(req.user.userId, req.body.currentPassword, req.body.newPassword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async getMe(req, res, next) {
  try {
    const user = await userService.findById(req.user.userId);
    res.json({ email: user.email }); // Only return email for simplicity
  } catch (error) {
    next(error);
  }
}
  // Add more controllers later
}

module.exports = new UserController();