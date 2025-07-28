const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth'); // Import middleware

// Signup routes
router.post('/register', userController.registerAdmin);
router.post('/registeruser', userController.registerUser);
router.get('/confirm/:token', userController.confirmEmail);
router.post('/login', userController.login);

// Protected admin route
router.get('/stats', authMiddleware, userController.getUserStats);
router.post('/change-password', authMiddleware, userController.changePassword);
router.get('/me', authMiddleware, userController.getMe);
router.get('/all', authMiddleware, userController.getAllUsers);
router.put('/update/:id', authMiddleware, userController.updateUserFields);
router.post('/create-user', authMiddleware, userController.createUserByAdmin);

module.exports = router;