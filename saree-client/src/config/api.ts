const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SAREES: `${API_BASE_URL}/api/sarees`,
  SAREE_BY_ID: (id: string) => `${API_BASE_URL}/api/sarees/${id}`,

   CATEGORIES: `${API_BASE_URL}/api/categories`,
  CATEGORY_BY_ID: (id: string) => `${API_BASE_URL}/api/categories/${id}`,
};

export default API_BASE_URL;
