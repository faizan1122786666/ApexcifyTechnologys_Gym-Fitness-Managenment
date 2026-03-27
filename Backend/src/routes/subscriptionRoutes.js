const express = require('express');
const {
    getSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
} = require('../controllers/subscriptionController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/', getSubscriptions);
router.get('/:id', getSubscriptionById);

// Admin only
router.post('/', protect, admin, createSubscription);
router.put('/:id', protect, admin, updateSubscription);
router.delete('/:id', protect, admin, deleteSubscription);

module.exports = router;
