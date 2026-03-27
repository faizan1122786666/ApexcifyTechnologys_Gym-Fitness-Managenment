const Plan = require('../models/Plan');

// @desc    Get all public plans
// @route   GET /api/plans
// @access  Public
const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find({ isPublic: true }).populate('createdBy', 'name');
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get plan by ID
// @route   GET /api/plans/:id
// @access  Private
const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id).populate('createdBy', 'name');
        if (plan) {
            res.json(plan);
        } else {
            res.status(404).json({ message: 'Plan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new plan
// @route   POST /api/plans
// @access  Private/Trainer or Admin
const createPlan = async (req, res) => {
    try {
        const { planName, description, type, exercises, meals, difficulty, isPublic } = req.body;

        const plan = await Plan.create({
            planName,
            description,
            type,
            exercises,
            meals,
            difficulty,
            createdBy: req.user._id,
            isPublic,
        });

        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get plans created by the logged-in user
// @route   GET /api/plans/myplans
// @access  Private
const getMyPlans = async (req, res) => {
    try {
        const plans = await Plan.find({ createdBy: req.user._id });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPlans,
    getPlanById,
    createPlan,
    getMyPlans,
};
