const express = require('express');
const { getPlans, getPlanById, createPlan, getMyPlans } = require('../controllers/planController');
const { protect, trainer } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getPlans);
router.get('/myplans', protect, getMyPlans);
router.get('/:id', protect, getPlanById);
router.post('/', protect, trainer, createPlan);

module.exports = router;
