const siteService = require('../services/siteService');

class SiteController {
  async getAllSites(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }
      const sites = await siteService.getAllSites();
      res.status(200).json(sites);
    } catch (error) {
      next(error);
    }
  }

  async createSite(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }
      const site = await siteService.createSite(req.body);
      res.status(201).json(site);
    } catch (error) {
      next(error);
    }
  }

  async deleteSite(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }
      const result = await siteService.deleteSite(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SiteController();