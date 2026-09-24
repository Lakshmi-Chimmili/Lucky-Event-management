const APP_NAME = "LuckyEvents";

const ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  STAFF: "staff"
};

const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  ASSIGNED: "assigned",
  IN_PROGRESS: "inProgress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REJECTED: "rejected"
};

const PRICING_TYPES = {
  FLAT: "flat",
  PER_ATTENDEE: "perAttendee"
};

module.exports = {
  APP_NAME,
  ROLES,
  BOOKING_STATUS,
  PRICING_TYPES
};
