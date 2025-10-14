
import { io } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
  withCredentials: true,
})

// Connection status logging (optional)
socket.on("connect", () => {
  // console.log("✅ Connected to server:", socket.id)
})

socket.on("disconnect", () => {
  // console.log("❌ Disconnected from server")
})

export default socket