const Line = require('../models/line');

class LineRepository {
  async findAll() {
    return await Line.find().populate('Profil', 'Title').populate('Device', 'Name');
  }

  async create(lineData) {
    const line = new Line(lineData);
    return await line.save();
  }

  async findById(id) {
    return await Line.findById(id).populate('Profil', 'Title').populate('Device', 'Name');
  }

  async updateById(id, updates) {
    return await Line.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return await Line.findByIdAndDelete(id);
  }
}

module.exports = new LineRepository();