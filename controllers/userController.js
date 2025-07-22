const userService = require('../services/userService');
const createError = require('http-errors');

class UserController {
  async registerAdmin(req, res, next) {
    try {
      const user = await userService.registerAdmin(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error.message === 'User already exists') {
        return next(createError(409, 'User already existssss'))
      }
    }
  }

  async registerUser(req, res, next) {
    try {
      const user = await userService.registerUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error.message === 'User already exists') {
        return next(createError(409, 'User already exists'));
      }
      next(error);
    }
  }

  // Add more controllers later
}

module.exports = new UserController();