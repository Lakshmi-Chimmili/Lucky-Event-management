import axios from 'axios';

// Dynamically determine the API base URL so the app works seamlessly on localhost and cloud deployments (Vercel/Render)
const getApiBaseUrl = () => {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.'));

  // 1. If running locally in browser, always connect to local backend
  if (isLocalhost) {
    return 'http://localhost:5000/api';
  }

  // 2. If running in production (Vercel/Render), ignore any localhost value
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    let url = envUrl.trim().replace(/\/$/, '');
    if (!url.endsWith('/api')) {
      url += '/api';
    }
    return url;
  }

  // 3. Default production cloud backend on Render
  return 'https://lucky-event-management-1.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 45000 // 45 seconds to accommodate Render free-tier cold starts
});

// Request interceptor: Attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Gracefully handle 401 Unauthorized for authenticated endpoints
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only wipe credentials if the request was an authenticated endpoint (exclude login & register)
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint =
        error.config &&
        (error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register'));

      if (!isAuthEndpoint) {
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
