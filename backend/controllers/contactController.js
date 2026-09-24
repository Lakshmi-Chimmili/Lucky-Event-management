const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and message are required'
      });
    }

    const contactMsg = await ContactMessage.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      message
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent successfully.',
      data: contactMsg
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error submitting message'
    });
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private (Admin)
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching contact messages'
    });
  }
};

// @desc    Mark contact message read
// @route   PATCH /api/contact/:id/read
// @access  Private (Admin)
const markContactMessageRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    msg.isRead = true;
    await msg.save();

    return res.status(200).json({
      success: true,
      data: msg
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating message status'
    });
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  markContactMessageRead
};
