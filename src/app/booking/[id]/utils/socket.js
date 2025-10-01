import { io } from "socket.io-client";

// তোমার backend server URL (যেখানে index.js চলছে)
const SOCKET_URL = "http://localhost:5000"; 

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});
