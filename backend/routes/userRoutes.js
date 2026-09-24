const express = require('express');
const router = express.Router();
const { getCustomers, toggleUserStatus } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/customers', protect, authorize('admin'), getCustomers);
router.patch('/:id/status', validateObjectId('id'), protect, authorize('admin'), toggleUserStatus);

module.exports = router;
