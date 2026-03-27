const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    period: {
        type: String,
        enum: ['month', 'quarter', 'year'],
        default: 'month',
    },
    features: [{
        type: String,
    }],
    color: {
        type: String,
        default: 'from-slate-500 to-gray-600',
    },
    popular: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
