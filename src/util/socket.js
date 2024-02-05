import { io } from "socket.io-client";

const socket = io("http://localhost:5005"); // or your Socket.IO server URL

export default socket;