const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    plan: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        enum: ['stripe', 'paypal', 'cash'],
        default: 'stripe',
    },
    stripePaymentId: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded', 'overdue'],
        default: 'pending',
    },
    nextDueDate: {
        type: Date,
    },
    cardLast4: {
        type: String,
        default: '',
    },
    cardBrand: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
