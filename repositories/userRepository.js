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
  async updateById(id, updates) {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  }
}

module.exports = new UserRepository();