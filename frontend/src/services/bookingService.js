import api from './api';

export const bookingService = {
  estimatePrice: async (payload) => {
    const response = await api.post('/bookings/estimate', payload);
    return response.data;
  },

  createBooking: async (bookingData) => {
    // Note: api.post('/bookings') maps to baseURL + '/bookings' = http://localhost:5000/api/bookings
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async (status = '') => {
    const response = await api.get(`/bookings/my${status ? `?status=${status}` : ''}`);
    return response.data;
  },

  getAssignedBookings: async () => {
    const response = await api.get('/bookings/assigned');
    return response.data;
  },

  getAllBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/bookings${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  assignStaff: async (id, staffId) => {
    const response = await api.patch(`/bookings/${id}/assign`, { staffId });
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  }
};
