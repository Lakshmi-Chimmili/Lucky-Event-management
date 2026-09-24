const Booking = require('../models/Booking');
const Category = require('../models/Category');
const Service = require('../models/Service');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { calculateBookingPrice } = require('../services/pricingService');

// @desc    Calculate price estimate live
// @route   POST /api/bookings/estimate
// @access  Public
const estimateBookingPrice = async (req, res) => {
  try {
    const { categoryId, attendeeCount, addOnIds } = req.body;

    if (!categoryId || !attendeeCount) {
      return res.status(400).json({
        success: false,
        message: 'Category ID and attendee count are required'
      });
    }

    const priceBreakdown = await calculateBookingPrice(
      categoryId,
      attendeeCount,
      addOnIds || []
    );

    return res.status(200).json({
      success: true,
      message: 'Price calculated successfully',
      data: priceBreakdown
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Price calculation error'
    });
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res) => {
  try {
    const {
      categoryId,
      addOnIds,
      attendeeCount,
      eventDate,
      eventTime,
      venueAddress,
      city,
      notes
    } = req.body;

    if (!categoryId || !attendeeCount || !eventDate || !eventTime || !venueAddress || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category, attendee count, date, time, venue address and city'
      });
    }

    const count = Number(attendeeCount);
    if (isNaN(count) || count <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid attendee count greater than 0'
      });
    }

    // Verify Category exists & active
    const categoryDoc = await Category.findById(categoryId);
    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: 'Selected event category was not found'
      });
    }
    if (!categoryDoc.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Selected event category is currently inactive'
      });
    }

    // Verify addOn services exist
    const selectedServiceIds = Array.isArray(addOnIds) ? addOnIds : [];
    if (selectedServiceIds.length > 0) {
      const services = await Service.find({ _id: { $in: selectedServiceIds }, isActive: true });
      if (services.length !== selectedServiceIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more selected services are invalid or inactive'
        });
      }
    }

    // Calculate server-side frozen price snapshot
    const priceBreakdown = await calculateBookingPrice(
      categoryDoc,
      count,
      selectedServiceIds
    );

    const booking = await Booking.create({
      customer: req.user._id,
      category: categoryDoc._id,
      addOns: selectedServiceIds,
      attendeeCount: count,
      eventDate: new Date(eventDate),
      eventTime,
      venueAddress,
      city,
      notes: notes || '',
      priceBreakdown,
      status: 'pending'
    });

    // Create notification for user
    await Notification.create({
      recipient: req.user._id,
      title: 'Booking Created',
      message: `Your booking for ${categoryDoc.name} on ${new Date(eventDate).toLocaleDateString()} has been received (ID: ${booking._id}).`,
      type: 'booking',
      bookingId: booking._id
    });

    // Requirement #20 / #55 response format
    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: await booking.populate(['category', 'addOns'])
    });
  } catch (error) {
    console.error('[Create Booking Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private (Customer)
const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { customer: req.user._id };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('category')
      .populate('addOns')
      .populate('assignedStaff', 'name phone email profileImage')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user bookings'
    });
  }
};

// @desc    Get staff's assigned bookings
// @route   GET /api/bookings/assigned
// @access  Private (Staff)
const getAssignedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ assignedStaff: req.user._id })
      .populate('customer', 'name email phone profileImage')
      .populate('category')
      .populate('addOns')
      .sort({ eventDate: 1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching staff assigned bookings'
    });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
const getAllBookings = async (req, res) => {
  try {
    const { status, category, date, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.eventDate = { $gte: startDate, $lte: endDate };
    }

    let bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate('category')
      .populate('addOns')
      .populate('assignedStaff', 'name email phone')
      .sort({ createdAt: -1 });

    // Client/Admin Search filtering if search term provided
    if (search) {
      const term = search.toLowerCase().trim();
      bookings = bookings.filter(b => {
        const idMatch = b._id.toString().toLowerCase().includes(term);
        const nameMatch = b.customer && b.customer.name && b.customer.name.toLowerCase().includes(term);
        const emailMatch = b.customer && b.customer.email && b.customer.email.toLowerCase().includes(term);
        const phoneMatch = b.customer && b.customer.phone && b.customer.phone.toLowerCase().includes(term);
        return idMatch || nameMatch || emailMatch || phoneMatch;
      });
    }

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching bookings'
    });
  }
};

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone profileImage')
      .populate('category')
      .populate('addOns')
      .populate('assignedStaff', 'name email phone profileImage');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Authorization check
    if (req.user.role === 'customer' && booking.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    if (req.user.role === 'staff' && (!booking.assignedStaff || booking.assignedStaff._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this unassigned booking'
      });
    }

    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching booking details'
    });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin or Staff assigned)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'assigned', 'inProgress', 'completed', 'cancelled', 'rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Staff authorization check
    if (req.user.role === 'staff') {
      if (!booking.assignedStaff || booking.assignedStaff.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
      }
      // Staff can only set inProgress or completed
      if (!['inProgress', 'completed'].includes(status)) {
        return res.status(403).json({ success: false, message: 'Staff can only set status to inProgress or completed' });
      }
    }

    booking.status = status;
    await booking.save();

    // Create Notification for Customer
    await Notification.create({
      recipient: booking.customer,
      title: 'Booking Status Updated',
      message: `Your booking (ID: ${booking._id}) status has been updated to: ${status.toUpperCase()}.`,
      type: 'booking',
      bookingId: booking._id
    });

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating booking status'
    });
  }
};

// @desc    Assign staff to booking
// @route   PATCH /api/bookings/:id/assign
// @access  Private (Admin)
const assignStaff = async (req, res) => {
  try {
    const { staffId } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (!staffId) {
      booking.assignedStaff = null;
    } else {
      const staffUser = await User.findById(staffId);
      if (!staffUser || staffUser.role !== 'staff') {
        return res.status(400).json({ success: false, message: 'Invalid staff member' });
      }
      booking.assignedStaff = staffUser._id;
      if (booking.status === 'pending' || booking.status === 'confirmed') {
        booking.status = 'assigned';
      }

      // Notify Staff member
      await Notification.create({
        recipient: staffUser._id,
        title: 'New Event Assigned',
        message: `You have been assigned to manage booking ID: ${booking._id}.`,
        type: 'assignment',
        bookingId: booking._id
      });
    }

    await booking.save();

    // Notify Customer
    await Notification.create({
      recipient: booking.customer,
      title: 'Event Staff Assigned',
      message: `An event manager has been assigned to your event (ID: ${booking._id}).`,
      type: 'booking',
      bookingId: booking._id
    });

    return res.status(200).json({
      success: true,
      message: 'Staff assigned successfully',
      data: await booking.populate(['category', 'assignedStaff'])
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error assigning staff'
    });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private (Customer for eligible booking or Admin)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role === 'customer') {
      if (booking.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
      }
      if (['inProgress', 'completed', 'cancelled', 'rejected'].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: `Booking cannot be cancelled when status is ${booking.status}`
        });
      }
    }

    booking.status = 'cancelled';
    await booking.save();

    await Notification.create({
      recipient: booking.customer,
      title: 'Booking Cancelled',
      message: `Booking ID: ${booking._id} has been cancelled.`,
      type: 'booking',
      bookingId: booking._id
    });

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling booking'
    });
  }
};

module.exports = {
  estimateBookingPrice,
  createBooking,
  getMyBookings,
  getAssignedBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  assignStaff,
  cancelBooking
};
