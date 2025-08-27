const express = require('express');
const router = express.Router();
const lineController = require('../controllers/lineController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, lineController.getAllLines);
router.post('/', authMiddleware, lineController.createLine);
router.get('/:id', authMiddleware, lineController.getLineById);
router.put('/:id', authMiddleware, lineController.updateLine);
router.delete('/:id', authMiddleware, lineController.deleteLine);

module.exports = router;