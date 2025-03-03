// src/services/api.js
import axios from 'axios';

// Create an axios instance with default configs and proper CORS settings
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 5000,
  // Only set withCredentials to true if your server is configured to accept credentials
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor: you can add authorization tokens or other headers here if needed.
apiClient.interceptors.request.use(
  config => {
    // Log request for debugging
    console.log('Making request to:', config.url, 'with method:', config.method);
    // Example: Uncomment and set your token if required
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: global error handling for API responses.
apiClient.interceptors.response.use(
  response => {
    console.log('Received response:', response.status);
    return response;
  },
  error => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      return Promise.reject(error.response.data || 'Server error');
    } else if (error.request) {
      console.error('Network Error:', error.request);
      return Promise.reject('Network error - no response from server');
    } else {
      console.error('Request Error:', error.message);
      return Promise.reject(error.message || 'Unknown error occurred');
    }
  }
);

// Generate sample feature data for testing
const generateSampleFeatures = (featureCount = 10) => {
  const features = [];
  for (let i = 0; i < featureCount; i++) {
    features.push(Math.random() * 10);
  }
  return features;
};

// Define API functions for interacting with your backend.
const api = {
  // Detect intrusion using a custom payload
  detectIntrusion: async (payload) => {
    try {
      const response = await apiClient.post('/detect', payload);
      return response.data;
    } catch (error) {
      console.error('Detection failed:', error);
      throw error.response?.data?.error || 'Failed to connect to IDS service';
    }
  },
    
  // Another version of the detect function that creates a payload from provided data
  detect: async (data = {}) => {
    const payload = {
      timestamp: data.timestamp || new Date().toISOString(),
      source_ip: data.source_ip || "192.168.1.1",
      destination_ip: data.destination_ip || "192.168.1.2",
      protocol: data.protocol || "TCP",
      features: data.features || generateSampleFeatures(78) // Adjust this number to match your feature count
    };
    try {
      console.log('Sending detection payload:', payload);
      const response = await apiClient.post('/detect', payload);
      return response.data;
    } catch (error) {
      console.error('Detection failed:', error);
      throw error.response?.data?.error || 'Failed to detect intrusion';
    }
  },
    
  // Retrieve historical intrusion detection data
  getHistory: async (params = {}) => {
    try {
      const response = await apiClient.get('/history', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch history:', error);
      throw error.response?.data?.error || 'Failed to fetch history';
    }
  },
    
  // Get server status
  getServerStatus: async () => {
    try {
      const response = await apiClient.get('/status');
      return response.data;
    } catch (error) {
      console.error('Failed to get server status:', error);
      throw error;
    }
  },
    
  // Update system settings
  updateSettings: async (settings) => {
    try {
      const response = await apiClient.post('/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  },
    
  // Perform a health check on the API
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error.response?.data?.error || 'API health check failed';
    }
  }
};

export default api;