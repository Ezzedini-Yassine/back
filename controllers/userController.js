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
  // Add more controllers later
}

module.exports = new UserController();