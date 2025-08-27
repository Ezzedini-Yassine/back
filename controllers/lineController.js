const lineService = require('../services/lineService');

class LineController {
  async getAllLines(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }
      const lines = await lineService.getAllLines();
      res.status(200).json(lines);
    } catch (error) {
      next(error);
    }
  }

  async createLine(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }
      const line = await lineService.createLine(req.body);
      res.status(201).json(line);
    } catch (error) {
      next(error);
    }
  }

  async getLineById(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }
      const line = await lineService.getLineById(req.params.id);
      res.status(200).json(line);
    } catch (error) {
      next(error);
    }
  }

  async updateLine(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }
      const line = await lineService.updateLine(req.params.id, req.body);
      res.status(200).json(line);
    } catch (error) {
      next(error);
    }
  }

  async deleteLine(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }
      const result = await lineService.deleteLine(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LineController();