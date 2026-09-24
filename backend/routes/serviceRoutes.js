const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', getServices);
router.get('/:id', validateObjectId('id'), getServiceById);
router.post('/', protect, authorize('admin'), createService);
router.put('/:id', validateObjectId('id'), protect, authorize('admin'), updateService);
router.delete('/:id', validateObjectId('id'), protect, authorize('admin'), deleteService);

module.exports = router;
