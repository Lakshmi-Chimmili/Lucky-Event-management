const express = require('express');
const router = express.Router();
const { getAllStaff, createStaff, updateStaff } = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', protect, authorize('admin', 'staff'), getAllStaff);
router.post('/', protect, authorize('admin'), createStaff);
router.put('/:id', validateObjectId('id'), protect, authorize('admin'), updateStaff);

module.exports = router;
