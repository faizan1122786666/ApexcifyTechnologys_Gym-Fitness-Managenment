const User = require('../models/User');
const Payment = require('../models/Payment');

// @desc    Admin creates a new trainer
// @route   POST /api/admin/create-trainer
// @access  Private/Admin
const createTrainer = async (req, res) => {
    try {
        const { name, email, password, profilePic } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const trainer = await User.create({
            name,
            email,
            password,
            role: 'trainer',
            profilePic: profilePic || '',
        });

        res.status(201).json({
            _id: trainer._id,
            name: trainer.name,
            email: trainer.email,
            role: trainer.role,
            profilePic: trainer.profilePic,
            joinedAt: trainer.joinedAt,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Admin creates a new member/user
// @route   POST /api/admin/create-user
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, profilePic } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Admin can create members, trainers, or even other admins
        const allowedRoles = ['member', 'trainer', 'admin'];
        const userRole = allowedRoles.includes(role) ? role : 'member';

        const user = await User.create({
            name,
            email,
            password,
            role: userRole,
            profilePic: profilePic || '',
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            joinedAt: user.joinedAt,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all users (members, trainers, admins)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = role ? { role } : {};

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user by ID (Admin can change name, email, role, etc.)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        if (req.body.profilePic !== undefined) {
            user.profilePic = req.body.profilePic;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profilePic: updatedUser.profilePic,
            joinedAt: updatedUser.joinedAt,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete user by ID
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats (total members, trainers, revenue, etc.)
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalMembers = await User.countDocuments({ role: 'member' });
        const totalTrainers = await User.countDocuments({ role: 'trainer' });
        const totalUsers = await User.countDocuments({});

        // Revenue stats
        const completedPayments = await Payment.find({ status: 'completed' });
        const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

        // Recent payments
        const recentPayments = await Payment.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('member', 'name email');

        // Monthly revenue (current month)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyPayments = await Payment.find({
            status: 'completed',
            createdAt: { $gte: startOfMonth },
        });
        const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

        // Overdue payments
        const overduePayments = await Payment.countDocuments({ status: 'overdue' });

        res.json({
            totalMembers,
            totalTrainers,
            totalUsers,
            totalRevenue,
            monthlyRevenue,
            overduePayments,
            recentPayments,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTrainer,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getDashboardStats,
};
