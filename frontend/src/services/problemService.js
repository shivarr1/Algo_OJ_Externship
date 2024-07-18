import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getProblemById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/problems/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
