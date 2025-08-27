const express = require('express');
const router = express.Router();
const dimmingController = require('../controllers/dimmingController');
const authMiddleware = require('../middlewares/auth');

router.get('/profiles', authMiddleware, dimmingController.getAllProfiles);
router.post('/profiles', authMiddleware, dimmingController.createProfile);
router.put('/profiles/:id', authMiddleware, dimmingController.updateProfile);
router.delete('/profiles/:id', authMiddleware, dimmingController.deleteProfile);
router.post('/assign', authMiddleware, dimmingController.assignProfileToSite);
router.get('/profiles/:id/devices', authMiddleware, dimmingController.getDevicesForProfile);

module.exports = router;