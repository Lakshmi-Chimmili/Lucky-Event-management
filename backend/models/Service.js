const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
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
    pricingType: {
      type: String,
      enum: ['flat', 'perAttendee'],
      required: [true, 'Pricing type is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

serviceSchema.index({ name: 1 });

module.exports = mongoose.model('Service', serviceSchema);
