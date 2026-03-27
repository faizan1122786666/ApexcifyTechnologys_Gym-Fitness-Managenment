const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    checkIn: {
        type: String,
        default: null,
    },
    checkOut: {
        type: String,
        default: null,
    },
    method: {
        type: String,
        enum: ['QR Code', 'Manual', null],
        default: null,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late'],
        default: 'absent',
    },
}, {
    timestamps: true,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
