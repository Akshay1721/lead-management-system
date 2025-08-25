import api from './api';

const leadService = {
  // Get leads with pagination and filters
  getLeads: async (params = {}) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },

  // Get single lead by ID
  getLead: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  // Create new lead
  createLead: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  // Update lead
  updateLead: async (id, leadData) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },

  // Delete lead
  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },

  // Build query parameters for filtering
  buildFilterParams: (filters) => {
    const params = {};
    
    Object.entries(filters).forEach(([field, filter]) => {
      if (filter.value !== undefined && filter.value !== '') {
        const paramKey = `${field}_${filter.operator}`;
        params[paramKey] = filter.value;
      }
    });
    
    return params;
  },
};

export default leadService;