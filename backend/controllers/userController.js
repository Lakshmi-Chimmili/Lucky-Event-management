const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all registered customers
// @route   GET /api/users/customers
// @access  Private (Admin)
const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-passwordHash').sort({ createdAt: -1 });

    // Attach booking counts for each customer
    const customerList = await Promise.all(
      customers.map(async (c) => {
        const bookingCount = await Booking.countDocuments({ customer: c._id });
        return {
          ...c.toObject(),
          bookingCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: customerList.length,
      data: customerList
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching customers'
    });
  }
};

// @desc    Toggle customer active status
// @route   PATCH /api/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = req.body.isActive !== undefined ? req.body.isActive : !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        _id: user._id,
        isActive: user.isActive
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating user status'
    });
  }
};

module.exports = {
  getCustomers,
  toggleUserStatus
};
