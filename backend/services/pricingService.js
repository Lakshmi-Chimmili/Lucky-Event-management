const Category = require('../models/Category');
const Service = require('../models/Service');

/**
 * Calculates itemized price breakdown for a booking
 * @param {string|Object} categoryInput Category document or ObjectId
 * @param {number} attendeeCount Number of attendees (> 0)
 * @param {Array<string|Object>} serviceInputs Array of Service documents or ObjectIds
 * @returns {Promise<Object>} Complete priceBreakdown object
 */
const calculateBookingPrice = async (categoryInput, attendeeCount, serviceInputs = []) => {
  const count = Number(attendeeCount);
  if (isNaN(count) || count <= 0) {
    throw new Error('Attendee count must be a positive integer');
  }

  // Fetch Category if string/ObjectId passed
  let categoryDoc = categoryInput;
  if (typeof categoryInput === 'string' || categoryInput.constructor.name === 'ObjectId') {
    categoryDoc = await Category.findById(categoryInput);
  }

  if (!categoryDoc) {
    throw new Error('Category not found');
  }
  if (!categoryDoc.isActive) {
    throw new Error('Selected category is inactive');
  }

  const categoryPricePerAttendee = Number(categoryDoc.basePricePerAttendee);
  const categoryTotal = categoryPricePerAttendee * count;

  // Process services
  const servicesBreakdown = [];
  let addOnsTotal = 0;

  if (Array.isArray(serviceInputs) && serviceInputs.length > 0) {
    for (const sInput of serviceInputs) {
      let serviceDoc = sInput;
      if (typeof sInput === 'string' || sInput.constructor.name === 'ObjectId') {
        serviceDoc = await Service.findById(sInput);
      }

      if (!serviceDoc) {
        throw new Error(`Service not found: ${sInput}`);
      }
      if (!serviceDoc.isActive) {
        throw new Error(`Service is currently inactive: ${serviceDoc.name}`);
      }

      const unitPrice = Number(serviceDoc.price);
      let quantity = 1;
      let total = 0;

      if (serviceDoc.pricingType === 'flat') {
        quantity = 1;
        total = unitPrice;
      } else if (serviceDoc.pricingType === 'perAttendee') {
        quantity = count;
        total = unitPrice * count;
      } else {
        total = unitPrice;
      }

      servicesBreakdown.push({
        serviceId: serviceDoc._id,
        name: serviceDoc.name,
        pricingType: serviceDoc.pricingType,
        unitPrice,
        quantity,
        total
      });

      addOnsTotal += total;
    }
  }

  const grandTotal = categoryTotal + addOnsTotal;

  return {
    categoryPricePerAttendee,
    attendeeCount: count,
    categoryTotal,
    services: servicesBreakdown,
    addOnsTotal,
    grandTotal
  };
};

module.exports = {
  calculateBookingPrice
};
