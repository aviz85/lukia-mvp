import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-url.com'  // Replace with your actual backend URL
  : '';

export const fetchLukons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/example`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Add other API calls as needed