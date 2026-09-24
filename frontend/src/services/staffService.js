import api from './api';

export const staffService = {
  getAll: async () => {
    const response = await api.get('/staff');
    return response.data;
  },

  create: async (staffData) => {
    const response = await api.post('/staff', staffData);
    return response.data;
  },

  update: async (id, staffData) => {
    const response = await api.put(`/staff/${id}`, staffData);
    return response.data;
  }
};
