"use client";

import useAutoRefresh from "./useAutoRefresh";

export default function AutoRefreshProvider({ children }) {
  useAutoRefresh();

  return <>{children}</>;
}
