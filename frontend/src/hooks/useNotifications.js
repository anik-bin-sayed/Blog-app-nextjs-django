"use client";

import { useEffect, useRef } from "react";

const WS_BASE = (process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000").replace(/\/+$/, "");

export default function useNotifications(userId, setNotifications, setUnreadCounts) {
  const setNotificationsRef = useRef(setNotifications);
  const setUnreadCountRef = useRef(setUnreadCounts);
  setNotificationsRef.current = setNotifications;
  setUnreadCountRef.current = setUnreadCounts;

  useEffect(() => {
    if (!userId) return undefined;

    let stopped = false;
    let socket = null;
    let reconnectTimer = null;
    let retryDelay = 1000;

    const connect = () => {
      if (stopped) return;
      socket = new WebSocket(`${WS_BASE}/ws/notifications/`);

      socket.onopen = () => {
        retryDelay = 1000;
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "notification") {
            const notification = payload.notification || payload;
            if (notification?.id != null) {
              setNotificationsRef.current((previous) => [
                notification,
                ...previous.filter((item) => item.id !== notification.id),
              ]);
              if (!notification.is_read) {
                setUnreadCountRef.current?.((previous) => (Number(previous) || 0) + 1);
              }
            }
          } else if (payload.type === "unread_count") {
            setUnreadCountRef.current?.(payload.count);
          }
        } catch {
          // Ignore malformed messages and keep the socket available for later events.
        }
      };

      // Browsers intentionally expose little detail for failed WebSocket handshakes.
      // The close handler below retries transient failures without noisy console errors.
      socket.onerror = () => {};

      socket.onclose = (event) => {
        if (stopped || event.code === 4403) return;
        const delay = event.code === 4401 ? 10000 : retryDelay;
        reconnectTimer = setTimeout(connect, delay);
        retryDelay = Math.min(Math.max(retryDelay * 2, 10000), 30000);
      };
    };

    connect();

    return () => {
      stopped = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        socket.close(1000, "Notifications view closed");
      }
    };
  }, [userId]);
}
