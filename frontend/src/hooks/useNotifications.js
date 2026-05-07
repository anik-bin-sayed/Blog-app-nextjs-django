"use client";

import { useEffect } from "react";

export default function useNotifications(auth, setNotifications) {
  useEffect(() => {
    if (!auth) return;

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [data, ...prev]);
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("Disconnected");
    };

    return () => socket.close();
  }, [auth]);
}
