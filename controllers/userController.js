const userService = require('../services/userService');

class UserController {
  async registerAdmin(req, res, next) {
    try {
      const user = await userService.registerAdmin(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async registerUser(req, res, next) {
    try {
      const user = await userService.registerUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  // Add more controllers later
}

module.exports = new UserController();