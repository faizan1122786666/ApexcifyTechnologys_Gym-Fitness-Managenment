const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');

// @desc    Create Stripe checkout session for card payment
// @route   POST /api/payments/create-checkout-session
// @access  Private
const createCheckoutSession = async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        const subscription = await Subscription.findById(subscriptionId);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription plan not found' });
        }

        // Create Stripe checkout session for card payment
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: req.user.email,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: subscription.name,
                            description: `${subscription.name} - ${subscription.period} subscription`,
                        },
                        unit_amount: Math.round(subscription.price * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: req.user._id.toString(),
                subscriptionId: subscription._id.toString(),
                subscriptionName: subscription.name,
                period: subscription.period,
            },
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        });

        // Create a pending payment record
        await Payment.create({
            member: req.user._id,
            amount: subscription.price,
            plan: subscription.name,
            method: 'stripe',
            stripePaymentId: session.id,
            status: 'pending',
            nextDueDate: calculateNextDueDate(subscription.period),
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Stripe webhook handler — confirms card payment
// @route   POST /api/payments/webhook
// @access  Public (Stripe calls this)
const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle card payment success
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            // Update payment status to completed
            const payment = await Payment.findOne({ stripePaymentId: session.id });

            if (payment) {
                payment.status = 'completed';

                // Store card details from the payment
                if (session.payment_method_types && session.payment_method_types.includes('card')) {
                    payment.method = 'stripe';
                    // Retrieve payment intent for card details
                    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
                    if (paymentIntent.payment_method) {
                        const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
                        if (paymentMethod.card) {
                            payment.cardLast4 = paymentMethod.card.last4;
                            payment.cardBrand = paymentMethod.card.brand;
                        }
                    }
                }

                await payment.save();
            }
        } catch (error) {
            console.error('Error processing webhook:', error);
        }
    }

    // Handle card payment failure
    if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
        const session = event.data.object;
        try {
            const payment = await Payment.findOne({ stripePaymentId: session.id });
            if (payment) {
                payment.status = 'failed';
                await payment.save();
            }
        } catch (error) {
            console.error('Error handling failed payment:', error);
        }
    }

    res.json({ received: true });
};

// @desc    Get payment history for logged-in user
// @route   GET /api/payments/my-payments
// @access  Private
const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ member: req.user._id })
            .sort({ createdAt: -1 })
            .populate('member', 'name email');

        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find({})
            .sort({ createdAt: -1 })
            .populate('member', 'name email');

        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('member', 'name email');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Only allow the member who made the payment or an admin to view it
        if (payment.member._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this payment' });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify payment status after redirect
// @route   GET /api/payments/verify/:sessionId
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const payment = await Payment.findOne({ stripePaymentId: sessionId });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json({
            status: session.payment_status,
            payment: {
                _id: payment._id,
                amount: payment.amount,
                plan: payment.plan,
                status: payment.status,
                method: payment.method,
                cardLast4: payment.cardLast4,
                cardBrand: payment.cardBrand,
                createdAt: payment.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Record a manual/cash payment (Admin only)
// @route   POST /api/payments/manual
// @access  Private/Admin
const createManualPayment = async (req, res) => {
    try {
        const { memberId, amount, plan, method, status } = req.body;

        const payment = await Payment.create({
            member: memberId,
            amount,
            plan,
            method: method || 'cash',
            status: status || 'completed',
            nextDueDate: calculateNextDueDate('month'),
        });

        const populatedPayment = await Payment.findById(payment._id).populate('member', 'name email');

        res.status(201).json(populatedPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Helper function
function calculateNextDueDate(period) {
    const now = new Date();
    switch (period) {
        case 'month':
            return new Date(now.setMonth(now.getMonth() + 1));
        case 'quarter':
            return new Date(now.setMonth(now.getMonth() + 3));
        case 'year':
            return new Date(now.setFullYear(now.getFullYear() + 1));
        default:
            return new Date(now.setMonth(now.getMonth() + 1));
    }
}

module.exports = {
    createCheckoutSession,
    stripeWebhook,
    getMyPayments,
    getAllPayments,
    getPaymentById,
    verifyPayment,
    createManualPayment,
};
