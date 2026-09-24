import api from './api';

export const contactService = {
  submit: async (messageData) => {
    const response = await api.post('/contact', messageData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  markRead: async (id) => {
    const response = await api.patch(`/contact/${id}/read`);
    return response.data;
  }
};
