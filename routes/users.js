const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Signup routes
router.post('/register', userController.registerAdmin);
router.post('/registeruser', userController.registerUser);
router.get('/confirm/:token', userController.confirmEmail)

// Add more routes later (e.g., login)

module.exports = router;