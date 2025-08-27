const dimmingService = require('../services/dimmingService');

class DimmingController {
  async getAllProfiles(req, res, next) {
    try {
      const profiles = await dimmingService.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      next(error);
    }
  }

  async createProfile(req, res, next) {
    try {
      const profile = await dimmingService.createProfile(req.body);
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const profile = await dimmingService.updateProfile(req.params.id, req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req, res, next) {
    try {
      const result = await dimmingService.deleteProfile(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async assignProfileToSite(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    const { profileId, sites } = req.body;
    const result = await dimmingService.assignProfileToSite(profileId, sites);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

  async getDevicesForProfile(req, res, next) {
    try {
      const devices = await dimmingService.getDevicesForProfile(req.params.id);
      res.json(devices);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DimmingController();