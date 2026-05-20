"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/services/auth/authSlice";
import { useLogoutMutation } from "@/redux/services/auth/authApi";

/**
 * Session Management Hook
 * Handles:
 * - Activity tracking
 * - Auto-logout on inactivity
 * - Session timeout warnings
 */
const useSessionManagement = (options = {}) => {
  const {
    inactivityTimeout = 30 * 60 * 1000, // 30 minutes
    warningTime = 5 * 60 * 1000, // 5 minutes before logout
    checkInterval = 60 * 1000, // Check every 1 minute
  } = options;

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.auth);
  const [logout] = useLogoutMutation();

  const inactivityTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const isWarningShownRef = useRef(false);

  /**
   * Reset inactivity timer
   */
  const resetInactivityTimer = () => {
    lastActivityRef.current = Date.now();
    isWarningShownRef.current = false;

    // Clear existing timers
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

    if (!auth) return;

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      if (!isWarningShownRef.current) {
        isWarningShownRef.current = true;
        // Dispatch warning event or show modal
        window.dispatchEvent(
          new CustomEvent("sessionWarning", {
            detail: {
              message: "Your session will expire in 5 minutes due to inactivity",
              timeRemaining: 5 * 60 * 1000,
            },
          }),
        );
      }
    }, inactivityTimeout - warningTime);

    // Set logout timer
    inactivityTimerRef.current = setTimeout(async () => {
      try {
        // Call logout endpoint
        await logout().unwrap();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Dispatch logout action regardless
        dispatch(logoutUser());
      }
    }, inactivityTimeout);
  };

  /**
   * Track user activity
   */
  useEffect(() => {
    if (!auth) return;

    const activityEvents = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      // Only reset timer if enough time has passed (avoid rapid resets)
      if (timeSinceLastActivity > checkInterval) {
        resetInactivityTimer();
      }
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial timer setup
    resetInactivityTimer();

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });

      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [auth, logout, dispatch, inactivityTimeout, warningTime, checkInterval]);

  /**
   * Manually extend session
   */
  const extendSession = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    isWarningShownRef.current = false;
    resetInactivityTimer();
  };

  return {
    extendSession,
    getTimeUntilLogout: () => {
      if (!auth) return null;
      const timeLeft = inactivityTimeout - (Date.now() - lastActivityRef.current);
      return Math.max(0, timeLeft);
    },
  };
};

export default useSessionManagement;
