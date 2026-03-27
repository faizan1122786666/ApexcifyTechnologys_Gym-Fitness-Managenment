const Subscription = require('../models/Subscription');

// @desc    Get all active subscription plans
// @route   GET /api/subscriptions
// @access  Public
const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ isActive: true });
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get subscription by ID
// @route   GET /api/subscriptions/:id
// @access  Public
const getSubscriptionById = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription plan not found' });
        }

        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new subscription plan
// @route   POST /api/subscriptions
// @access  Private/Admin
const createSubscription = async (req, res) => {
    try {
        const { name, price, period, features, color, popular } = req.body;

        const subscription = await Subscription.create({
            name,
            price,
            period,
            features,
            color,
            popular,
        });

        res.status(201).json(subscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a subscription plan
// @route   PUT /api/subscriptions/:id
// @access  Private/Admin
const updateSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription plan not found' });
        }

        subscription.name = req.body.name || subscription.name;
        subscription.price = req.body.price !== undefined ? req.body.price : subscription.price;
        subscription.period = req.body.period || subscription.period;
        subscription.features = req.body.features || subscription.features;
        subscription.color = req.body.color || subscription.color;
        subscription.popular = req.body.popular !== undefined ? req.body.popular : subscription.popular;
        subscription.isActive = req.body.isActive !== undefined ? req.body.isActive : subscription.isActive;

        const updatedSubscription = await subscription.save();

        res.json(updatedSubscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a subscription plan
// @route   DELETE /api/subscriptions/:id
// @access  Private/Admin
const deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription plan not found' });
        }

        await Subscription.findByIdAndDelete(req.params.id);

        res.json({ message: 'Subscription plan removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
};
