import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.1.10:3000";
let socket: Socket | null = null;

export const initSocket = (userId?: string) => {
    if (!socket) {
        socket = io(API_URL, {
            transports: ["websocket"],
            query: { userId },
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on("connect", () => console.log("🔌 Socket connected"));
        socket.on("disconnect", () => console.log("❌ Socket disconnected"));
        socket.on("connect_error", (err) => console.error("⚠️ Socket error:", err.message));
    }
    return socket;
};

export const getSocket = () => socket;
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
