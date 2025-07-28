const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, siteController.getAllSites);
router.post('/', authMiddleware, siteController.createSite);
router.delete('/:id', authMiddleware, siteController.deleteSite);

module.exports = router;