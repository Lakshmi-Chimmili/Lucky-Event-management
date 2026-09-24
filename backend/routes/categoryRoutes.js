const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', getCategories);
router.get('/:id', validateObjectId('id'), getCategoryById);
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', validateObjectId('id'), protect, authorize('admin'), updateCategory);
router.delete('/:id', validateObjectId('id'), protect, authorize('admin'), deleteCategory);

module.exports = router;
