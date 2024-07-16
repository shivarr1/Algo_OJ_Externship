import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/auth/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};