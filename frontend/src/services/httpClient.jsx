import axios from "axios";

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://codearena-653z.onrender.com";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default httpClient;
