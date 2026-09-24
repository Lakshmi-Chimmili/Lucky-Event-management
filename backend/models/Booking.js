const mongoose = require('mongoose');

const serviceBreakdownSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    name: String,
    pricingType: {
      type: String,
      enum: ['flat', 'perAttendee']
    },
    unitPrice: Number,
    quantity: Number,
    total: Number
  },
  { _id: false }
);

const priceBreakdownSchema = new mongoose.Schema(
  {
    categoryPricePerAttendee: Number,
    attendeeCount: Number,
    categoryTotal: Number,
    services: [serviceBreakdownSchema],
    addOnsTotal: Number,
    grandTotal: Number
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    addOns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
      }
    ],
    attendeeCount: {
      type: Number,
      required: [true, 'Attendee count is required'],
      min: [1, 'At least 1 attendee is required']
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required']
    },
    eventTime: {
      type: String,
      required: [true, 'Event time is required']
    },
    venueAddress: {
      type: String,
      required: [true, 'Venue address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    notes: {
      type: String,
      default: ''
    },
    priceBreakdown: {
      type: priceBreakdownSchema,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'assigned', 'inProgress', 'completed', 'cancelled', 'rejected'],
      default: 'pending'
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

bookingSchema.index({ customer: 1 });
bookingSchema.index({ eventDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ assignedStaff: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
