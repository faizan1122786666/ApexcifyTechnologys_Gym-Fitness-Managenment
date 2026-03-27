const Attendance = require('../models/Attendance');

// @desc    Check-in member
// @route   POST /api/attendance/check-in
// @access  Private
const checkIn = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Check if already checked in today
        let attendance = await Attendance.findOne({
            member: req.user._id,
            date: today,
        });

        if (attendance && attendance.checkIn) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        const now = new Date();
        const checkInTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

        if (attendance) {
            attendance.checkIn = checkInTime;
            attendance.status = 'present';
            attendance.method = req.body.method || 'Manual';
        } else {
            attendance = await Attendance.create({
                member: req.user._id,
                date: today,
                checkIn: checkInTime,
                status: 'present',
                method: req.body.method || 'Manual',
            });
        }

        await attendance.save();

        res.json({ message: 'Checked in successfully', attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check-out member
// @route   POST /api/attendance/check-out
// @access  Private
const checkOut = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findOne({
            member: req.user._id,
            date: today,
        });

        if (!attendance || !attendance.checkIn) {
            return res.status(400).json({ message: 'You have not checked in today' });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: 'Already checked out today' });
        }

        const now = new Date();
        attendance.checkOut = now.toTimeString().split(' ')[0];
        await attendance.save();

        res.json({ message: 'Checked out successfully', attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-attendance
// @access  Private
const getMyAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ member: req.user._id })
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all attendance records (Admin/Trainer)
// @route   GET /api/attendance
// @access  Private/Admin or Trainer
const getAllAttendance = async (req, res) => {
    try {
        const { date, memberId } = req.query;
        const filter = {};

        if (date) filter.date = date;
        if (memberId) filter.member = memberId;

        const attendance = await Attendance.find(filter)
            .populate('member', 'name email profilePic')
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark attendance manually (Admin/Trainer)
// @route   POST /api/attendance/mark
// @access  Private/Admin or Trainer
const markAttendance = async (req, res) => {
    try {
        const { memberId, date, status, checkIn, checkOut } = req.body;

        let attendance = await Attendance.findOne({
            member: memberId,
            date: date,
        });

        if (attendance) {
            attendance.status = status || attendance.status;
            attendance.checkIn = checkIn || attendance.checkIn;
            attendance.checkOut = checkOut || attendance.checkOut;
            attendance.method = 'Manual';
        } else {
            attendance = new Attendance({
                member: memberId,
                date: date,
                checkIn: checkIn || null,
                checkOut: checkOut || null,
                method: 'Manual',
                status: status || 'present',
            });
        }

        await attendance.save();

        const populated = await Attendance.findById(attendance._id)
            .populate('member', 'name email');

        res.json(populated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    checkIn,
    checkOut,
    getMyAttendance,
    getAllAttendance,
    markAttendance,
};
