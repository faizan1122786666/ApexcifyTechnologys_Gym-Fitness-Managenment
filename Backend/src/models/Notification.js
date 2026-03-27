const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ['NEW_USER', 'NEW_PAYMENT', 'NEW_CLASS', 'SYSTEM_ALERT'],
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            required: true,
            default: false,
        },
        data: {
            type: mongoose.Schema.Types.Mixed, // Stores metadata like userId or paymentId
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
