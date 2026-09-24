const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
    const unreadCount = notifications.filter(n => !n.read).length;

    return res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching notifications'
    });
  }
};

// @desc    Mark notification read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating notification'
    });
  }
};

module.exports = {
  getMyNotifications,
  markNotificationRead
};
