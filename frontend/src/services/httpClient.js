import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true, // Include cookies for session management
  });
  

export default httpClient;
