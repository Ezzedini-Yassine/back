const DimmingProfile = require('../models/dimmingProfile');
const Site = require('../models/sites');
const payloadChecker = require('payload-validator');

class DimmingService {
  async getAllProfiles() {
    return await DimmingProfile.find();
  }

  async createProfile(profileData) {
    const expectedPayload = {
      Title: { type: 'string', required: true },
      Time: { type: 'array', required: true },
      Lampe_level: { type: 'array', required: true },
      Periodic: { type: 'number', required: true },
      Annual: { type: 'number', required: true },
    };
    const validation = payloadChecker.validator(profileData, expectedPayload, Object.keys(expectedPayload), false);
    if (validation.hasError) {
      throw new Error(`Validation error: ${JSON.stringify(validation.response.errorMessage)}`);
    }

    const profile = new DimmingProfile(profileData);
    return await profile.save();
  }

  async updateProfile(id, updates) {
    const profile = await DimmingProfile.findByIdAndUpdate(id, updates, { new: true });
    if (!profile) throw new Error('Profile not found');
    return profile;
  }

  async deleteProfile(id) {
    const profile = await DimmingProfile.findByIdAndDelete(id);
    if (!profile) throw new Error('Profile not found');
    return { message: 'Profile deleted successfully' };
  }

  async assignProfileToSite(profileId, sites) {
  const Site = require('../models/sites');
  if (sites === 'global') {
    // Assign to all sites
    const allSites = await Site.updateMany({}, { Profil: profileId });
    return { message: `Profile ${profileId} assigned to all ${allSites.modifiedCount} sites` };
  } else if (Array.isArray(sites)) {
    // Assign to specific sites
    const updatePromises = sites.map(siteId => Site.findByIdAndUpdate(siteId, { Profil: profileId }, { new: true }));
    const updatedSites = await Promise.all(updatePromises);
    return { message: `Profile ${profileId} assigned to ${updatedSites.length} sites`, sites: updatedSites };
  } else {
    throw new Error('Invalid sites parameter');
  }
}

  async getDevicesForProfile(profileId) {
    // Example: Fetch devices linked via sites/lines
    const devices = await Device.find({ Profil: profileId });
    return devices;
  }
}

module.exports = new DimmingService();