const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    image: {
      type: String,
      default: ''
    },
    basePricePerAttendee: {
      type: Number,
      required: [true, 'Base price per attendee is required'],
      min: [0, 'Price must be positive']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);
