import axios from 'axios';

const httpClient = axios.create({
    // baseURL: 'http://localhost:5000',
    baseURL: 'https://codearena-653z.onrender.com',
    withCredentials: true, // Include cookies for session management
  });
  

export default httpClient;
