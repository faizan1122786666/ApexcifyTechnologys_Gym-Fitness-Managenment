const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    schedule: {
        day: {
            type: String,
            required: true,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        time: {
            type: String,
            required: true,
        },
    },
    capacity: {
        type: Number,
        default: 20,
    },
    enrolledMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    price: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
