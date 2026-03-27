const express = require('express');
const {
    checkIn,
    checkOut,
    getMyAttendance,
    getAllAttendance,
    markAttendance,
} = require('../controllers/attendanceController');
const { protect, trainer } = require('../middleware/authMiddleware');

const router = express.Router();

// Member self-service
router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.get('/my-attendance', protect, getMyAttendance);

// Admin/Trainer access
router.get('/', protect, trainer, getAllAttendance);
router.post('/mark', protect, trainer, markAttendance);

module.exports = router;
