const express = require('express');
const router = express.Router();
const {
  estimateBookingPrice,
  createBooking,
  getMyBookings,
  getAssignedBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  assignStaff,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// Live calculation (Public or Auth)
router.post('/estimate', estimateBookingPrice);

// Customer endpoints
router.post('/', protect, authorize('customer', 'admin'), createBooking);
router.get('/my', protect, authorize('customer'), getMyBookings);

// Staff endpoints
router.get('/assigned', protect, authorize('staff'), getAssignedBookings);

// Admin endpoints
router.get('/', protect, authorize('admin'), getAllBookings);

// Single booking endpoints with ObjectId validation
router.get('/:id', validateObjectId('id'), protect, getBookingById);
router.patch('/:id/status', validateObjectId('id'), protect, authorize('admin', 'staff'), updateBookingStatus);
router.patch('/:id/assign', validateObjectId('id'), protect, authorize('admin'), assignStaff);
router.delete('/:id', validateObjectId('id'), protect, authorize('customer', 'admin'), cancelBooking);

module.exports = router;
