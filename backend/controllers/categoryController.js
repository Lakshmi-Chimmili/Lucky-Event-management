const Category = require('../models/Category');

// @desc    Get all categories (public gets active, admin gets all)
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching categories'
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching category'
    });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, image, basePricePerAttendee } = req.body;

    if (!name || basePricePerAttendee === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name and base price per attendee are required'
      });
    }

    const category = await Category.create({
      name,
      description: description || '',
      image: image || '',
      basePricePerAttendee: Number(basePricePerAttendee)
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating category'
    });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description, image, basePricePerAttendee, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (basePricePerAttendee !== undefined) category.basePricePerAttendee = Number(basePricePerAttendee);
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating category'
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting category'
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
