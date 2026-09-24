const express = require('express');
const router = express.Router();
const { getAdminReports } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/dashboard', protect, authorize('admin'), getAdminReports);

module.exports = router;
