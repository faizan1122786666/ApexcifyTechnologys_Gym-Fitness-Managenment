const express = require('express');
const {
    createTrainer,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getDashboardStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, admin);

// Dashboard stats
router.get('/dashboard-stats', getDashboardStats);

// Admin creates a trainer
router.post('/create-trainer', createTrainer);

// Admin creates a user (any role)
router.post('/create-user', createUser);

// Admin manages all users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
