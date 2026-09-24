const Booking = require('../models/Booking');
const User = require('../models/User');
const Category = require('../models/Category');

// @desc    Get admin statistics & aggregated reports
// @route   GET /api/reports/dashboard
// @access  Private (Admin)
const getAdminReports = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const assignedBookings = await Booking.countDocuments({ status: 'assigned' });
    const inProgressBookings = await Booking.countDocuments({ status: 'inProgress' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const rejectedBookings = await Booking.countDocuments({ status: 'rejected' });

    // Total Revenue calculation from completed and confirmed/assigned/inProgress bookings
    const revenueAggregation = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'assigned', 'inProgress', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$priceBreakdown.grandTotal' }
        }
      }
    ]);

    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Bookings grouped by category
    const bookingsByCategory = await Booking.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$priceBreakdown.grandTotal' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $project: {
          _id: 1,
          name: '$categoryInfo.name',
          count: 1,
          totalRevenue: 1
        }
      }
    ]);

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('customer', 'name email phone')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalCustomers,
          totalStaff,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          assignedBookings,
          inProgressBookings,
          completedBookings,
          cancelledBookings,
          rejectedBookings,
          totalRevenue
        },
        bookingsByCategory,
        recentBookings
      }
    });
  } catch (error) {
    console.error('[Reports Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating admin reports'
    });
  }
};

module.exports = {
  getAdminReports
};
