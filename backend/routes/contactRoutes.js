const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  markContactMessageRead
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.post('/', submitContactMessage);
router.get('/', protect, authorize('admin'), getContactMessages);
router.patch('/:id/read', validateObjectId('id'), protect, authorize('admin'), markContactMessageRead);

module.exports = router;
