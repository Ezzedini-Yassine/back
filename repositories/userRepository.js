const User = require('../models/users');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  // Add more methods later for other ops
}

module.exports = new UserRepository();