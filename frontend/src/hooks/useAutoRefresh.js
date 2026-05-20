"use client";

import { useRefreshMutation } from "@/redux/services/auth/authApi";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/services/auth/authSlice";
import Cookies from "js-cookie";

const useAutoRefresh = () => {
  const [refresh] = useRefreshMutation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.auth);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Only set up auto-refresh if user is authenticated
    if (!auth) {
      return;
    }

    const setupAutoRefresh = () => {
      // Check token expiry
      const expiryTime = Cookies.get("access_token_expiry");
      if (!expiryTime) {
        return;
      }

      const expiryMs = parseInt(expiryTime);
      const now = Date.now();
      const timeUntilExpiry = expiryMs - now;

      // If token already expired, don't set up auto-refresh
      if (timeUntilExpiry <= 0) {
        dispatch(logoutUser());
        return;
      }

      // Refresh 5 minutes before expiry
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60 * 1000);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          await refresh().unwrap();
          console.log("✓ Token auto-refreshed successfully");
          // Set up next refresh
          setupAutoRefresh();
        } catch (error) {
          console.error("✗ Auto-refresh failed:", error);
          // Log out user on refresh failure
          dispatch(logoutUser());
        }
      }, refreshTime);
    };

    // Initial setup
    setupAutoRefresh();

    // Listen for visibility changes (tab becomes active)
    const handleVisibilityChange = () => {
      if (document.hidden === false) {
        // Tab became visible, check if refresh is needed
        const expiryTime = Cookies.get("access_token_expiry");
        if (expiryTime) {
          const timeUntilExpiry = parseInt(expiryTime) - Date.now();
          if (timeUntilExpiry < 5 * 60 * 1000) {
            // Token expires soon, refresh now
            refresh().catch(() => dispatch(logoutUser()));
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [auth, refresh, dispatch]);

  return null;
};

export default useAutoRefresh;
