const Class = require('../models/Class');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public
const getClasses = async (req, res) => {
    try {
        const classes = await Class.find({}).populate('trainer', 'name profilePic');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get class by ID
// @route   GET /api/classes/:id
// @access  Public
const getClassById = async (req, res) => {
    try {
        const gymClass = await Class.findById(req.params.id).populate('trainer', 'name profilePic');
        if (gymClass) {
            res.json(gymClass);
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private/Trainer or Admin
const createClass = async (req, res) => {
    try {
        const { className, description, schedule, capacity, price, image } = req.body;

        const gymClass = await Class.create({
            className,
            description,
            trainer: req.user._id,
            schedule,
            capacity,
            price,
            image,
        });

        res.status(201).json(gymClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Enroll in a class
// @route   POST /api/classes/:id/enroll
// @access  Private/Member
const enrollInClass = async (req, res) => {
    try {
        const gymClass = await Class.findById(req.params.id);

        if (gymClass) {
            if (gymClass.enrolledMembers.length >= gymClass.capacity) {
                return res.status(400).json({ message: 'Class is full' });
            }

            if (gymClass.enrolledMembers.includes(req.user._id)) {
                return res.status(400).json({ message: 'Already enrolled in this class' });
            }

            gymClass.enrolledMembers.push(req.user._id);
            await gymClass.save();

            res.json({ message: 'Enrolled successfully' });
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getClasses,
    getClassById,
    createClass,
    enrollInClass,
};
