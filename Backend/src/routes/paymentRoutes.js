const express = require('express');
const {
    createCheckoutSession,
    stripeWebhook,
    getMyPayments,
    getAllPayments,
    getPaymentById,
    verifyPayment,
    createManualPayment,
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Card payment — Stripe checkout
router.post('/create-checkout-session', protect, createCheckoutSession);

// Stripe webhook (receives raw body, no auth)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Payment verification after card payment redirect
router.get('/verify/:sessionId', protect, verifyPayment);

// User's own payment history
router.get('/my-payments', protect, getMyPayments);

// Admin: all payments & manual payment entry
router.get('/', protect, admin, getAllPayments);
router.post('/manual', protect, admin, createManualPayment);

// Single payment details
router.get('/:id', protect, getPaymentById);

module.exports = router;
