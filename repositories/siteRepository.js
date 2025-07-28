const Site = require('../models/sites');

class SiteRepository {
  async findAll() {
    return await Site.find().populate('assignedUser', 'username email');
  }

  async create(siteData) {
    const site = new Site(siteData);
    return await site.save();
  }

  async deleteById(id) {
    return await Site.findByIdAndDelete(id);
  }
}

module.exports = new SiteRepository();