const mongoose = require('mongoose');

const staffProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    phone: {
      type: String,
      default: ''
    },
    specialization: {
      type: String,
      default: 'General Manager'
    },
    experience: {
      type: String,
      default: '3+ Years'
    },
    skills: [
      {
        type: String
      }
    ],
    availability: {
      type: Boolean,
      default: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StaffProfile', staffProfileSchema);
