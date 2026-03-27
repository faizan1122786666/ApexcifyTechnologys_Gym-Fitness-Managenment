const User = require('../models/User');
const Class = require('../models/Class');

// @desc    Get all trainers
// @route   GET /api/users/trainers
// @access  Public
const getTrainers = async (req, res) => {
    try {
        const trainers = await User.find({ role: 'trainer' }).select('-password');
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User find failed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }
            if (req.body.profilePic) {
                user.profilePic = req.body.profilePic;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePic: updatedUser.profilePic,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin update any user
// @route   PUT /api/users/admin/user/:id
// @access  Private/Admin
const adminUpdateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get members enrolled with a specific trainer
// @route   GET /api/users/trainer/members
// @access  Private/Trainer
const getTrainerMembers = async (req, res) => {
    try {
        // Find all classes taught by this trainer
        const classes = await Class.find({ trainer: req.user._id }).populate('enrolledMembers', 'name email profilePic joinedAt');
        
        // Extract unique members from all classes
        const memberMap = new Map();
        classes.forEach(cls => {
            cls.enrolledMembers.forEach(member => {
                memberMap.set(member._id.toString(), member);
            });
        });
        
        const uniqueMembers = Array.from(memberMap.values());
        res.json(uniqueMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTrainers,
    getUserProfile,
    updateUserProfile,
    adminUpdateUser,
    getTrainerMembers,
};

