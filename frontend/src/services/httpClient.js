import axios from 'axios';

const httpClient = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
    withCredentials: true, // Include cookies for session management
  });
  

export default httpClient;
