import axios from './httpClient';

const authService = {
  login: (data) => axios.post('/api/auth/login', data),
  signup: (data) => axios.post('/api/auth/signup', data),
};

export default authService;
