const User = require('../models/users');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findById(id) {
    return await User.findById(id);
  }
  // Add more methods later for other ops
}

module.exports = new UserRepository();