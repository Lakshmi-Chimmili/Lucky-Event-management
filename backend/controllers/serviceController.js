const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const services = await Service.find(filter).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching services'
    });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    return res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching service'
    });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const { name, description, image, pricingType, price } = req.body;

    if (!name || !pricingType || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, pricingType (flat or perAttendee), and price are required'
      });
    }

    if (!['flat', 'perAttendee'].includes(pricingType)) {
      return res.status(400).json({
        success: false,
        message: 'pricingType must be either "flat" or "perAttendee"'
      });
    }

    const service = await Service.create({
      name,
      description: description || '',
      image: image || '',
      pricingType,
      price: Number(price)
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating service'
    });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const { name, description, image, pricingType, price, isActive } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (name) service.name = name;
    if (description !== undefined) service.description = description;
    if (image !== undefined) service.image = image;
    if (pricingType) {
      if (!['flat', 'perAttendee'].includes(pricingType)) {
        return res.status(400).json({
          success: false,
          message: 'pricingType must be either "flat" or "perAttendee"'
        });
      }
      service.pricingType = pricingType;
    }
    if (price !== undefined) service.price = Number(price);
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating service'
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting service'
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
