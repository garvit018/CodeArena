import { io } from "socket.io-client";
import { API_BASE_URL } from "./services/httpClient.jsx";

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
  };

  return io(process.env.REACT_APP_SOCKET_URL || API_BASE_URL, options);
};
