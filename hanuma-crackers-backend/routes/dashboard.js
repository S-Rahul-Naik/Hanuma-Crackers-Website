const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDashboardOverview, getAnalytics } = require('../controllers/dashboardController');

router.get('/overview', protect, getDashboardOverview);
router.get('/analytics', protect, getAnalytics);

module.exports = router;
