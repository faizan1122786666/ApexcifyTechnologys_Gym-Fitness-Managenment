const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['workout', 'diet', 'hybrid'],
        required: true,
    },
    exercises: [{
        name: String,
        sets: Number,
        reps: Number,
        duration: String, // e.g. "30 mins"
    }],
    meals: [{
        time: String,
        food: String,
        calories: Number,
    }],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;
