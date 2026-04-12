import axios from "./httpClient";

const authService = {
  login: (data) => axios.post("/auth/login", data),
  signup: (data) => axios.post("/auth/signup", data),
};

export default authService;
