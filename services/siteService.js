const siteRepository = require('../repositories/siteRepository');
const payloadChecker = require('payload-validator');

class SiteService {
  async getAllSites() {
    return await siteRepository.findAll();
  }

  async createSite(siteData) {
    const expectedPayload = {
      name: { type: 'string', required: true },
      description: { type: 'string', required: true },
      lat: { type: 'number', required: true },
      lng: { type: 'number', required: true },
      assignedUser: { type: 'string', required: false }, // Optional ObjectId
    };
    const validation = payloadChecker.validator(siteData, expectedPayload, Object.keys(expectedPayload), false);
    if (validation.hasError) {
      throw new Error(`Validation error: ${JSON.stringify(validation.response.errorMessage)}`);
    }

    return await siteRepository.create({
      name: siteData.name,
      description: siteData.description,
      location: { lat: siteData.lat, lng: siteData.lng },
      assignedUser: siteData.assignedUser || null,
    });
  }

  async deleteSite(id) {
    const site = await siteRepository.deleteById(id);
    if (!site) throw new Error('Site not found');
    return { message: 'Site deleted successfully' };
  }
}

module.exports = new SiteService();