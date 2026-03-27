const express = require('express');
const { getClasses, getClassById, createClass, enrollInClass } = require('../controllers/classController');
const { protect, trainer } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getClasses);
router.get('/:id', getClassById);
router.post('/', protect, trainer, createClass);
router.post('/:id/enroll', protect, enrollInClass);

module.exports = router;
