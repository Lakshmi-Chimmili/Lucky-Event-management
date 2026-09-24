import api from './api';

export const userService = {
  getCustomers: async () => {
    const response = await api.get('/users/customers');
    return response.data;
  },

  toggleStatus: async (id, isActive) => {
    const response = await api.patch(`/users/${id}/status`, { isActive });
    return response.data;
  }
};
