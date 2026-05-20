"use client";

import { useEffect, useRef } from "react";

const WS_BASE =
  process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8000";

export default function useNotifications(userId, setNotifications) {
  const setNotificationsRef = useRef(setNotifications);
  setNotificationsRef.current = setNotifications;

  useEffect(() => {
    if (!userId) return;

    let closedByCleanup = false;
    const socket = new WebSocket(
      `${WS_BASE}/ws/notifications/${userId}/`,
    );

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setNotificationsRef.current((prev) => [data, ...prev]);
      } catch {
        console.error("Invalid WebSocket message:", event.data);
      }
    };

    socket.onerror = () => {
      if (!closedByCleanup) {
        console.error(
          `WebSocket connection failed (${WS_BASE}/ws/notifications/${userId}/)`,
        );
      }
    };

    return () => {
      closedByCleanup = true;
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };
  }, [userId]);
}
