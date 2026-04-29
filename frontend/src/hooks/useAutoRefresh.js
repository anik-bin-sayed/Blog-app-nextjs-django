"use client";

import { useRefreshMutation } from "@/redux/services/auth/authApi";
import { useEffect } from "react";

const useAutoRefresh = () => {
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    const interval = setInterval(
      async () => {
        try {
          await refresh().unwrap();
          console.log("Token refreshed");
        } catch (err) {
          console.log("Refresh failed", err);
        }
      },
      14 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [refresh]);
};

export default useAutoRefresh;
