const express = require('express');
const { getTrainers, getUserProfile, updateUserProfile, adminUpdateUser, getTrainerMembers } = require('../controllers/userController');
const { protect, admin, trainer } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/trainers', getTrainers);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.put('/admin/user/:id', protect, admin, adminUpdateUser);
router.get('/trainer/members', protect, trainer, getTrainerMembers);

module.exports = router;

