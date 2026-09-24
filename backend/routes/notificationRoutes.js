const express = require('express');
const router = express.Router();
const { getMyNotifications, markNotificationRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', protect, getMyNotifications);
router.patch('/:id/read', validateObjectId('id'), protect, markNotificationRead);

module.exports = router;
