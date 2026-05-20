import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutUser } from "../services/auth/authSlice";
import TokenManager from "@/utils/tokenManager";

let isRefreshing = false;
let refreshPromise = null;

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api",
  credentials: "include",
  prepareHeaders: (headers) => headers,
});

const waitForRefresh = () => {
  if (!refreshPromise) {
    refreshPromise = new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!isRefreshing) {
          clearInterval(checkInterval);
          refreshPromise = null;
          resolve();
        }
      }, 100);
    });
  }
  return refreshPromise;
};

const handleRefreshFailure = (api) => {
  if (TokenManager.isAuthenticated()) {
    api.dispatch(logoutUser());
    TokenManager.clearAllTokens();
  }
};

/**
 * Refresh via httpOnly cookies (backend sets access_token on success)
 */
const performTokenRefresh = async (api, extraOptions) => {
  const silentBaseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
    credentials: "include",
  });

  try {
    const refreshResult = await silentBaseQuery(
      { url: "/accounts/refresh", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult?.data) {
      const { access, refresh, expires_in } = refreshResult.data;

      if (access) {
        TokenManager.setAccessToken(access, expires_in || 3600);
      } else {
        TokenManager.markAccessTokenRefreshed(expires_in || 15 * 60);
      }

      if (refresh) {
        TokenManager.setRefreshToken(refresh);
      }

      return { data: refreshResult.data };
    }

    return { error: refreshResult.error };
  } catch (error) {
    return { error };
  }
};

/**
 * Main fetch interceptor with automatic token refresh
 */
const fetchBaseQueryWithReauth = async (args, api, extraOptions) => {
  const isRefreshRequest = args.url === "/accounts/refresh";
  const isLoginRequest = args.url === "/accounts/login";
  const isLogoutRequest = args.url === "/accounts/logout";

  if (isLoginRequest || isLogoutRequest || isRefreshRequest) {
    return baseQuery(args, api, extraOptions);
  }

  // Only logged-in users need token refresh (guests use public APIs)
  if (!isRefreshing && TokenManager.shouldAttemptRefresh()) {
    isRefreshing = true;

    try {
      const refreshResult = await performTokenRefresh(api, extraOptions);

      if (refreshResult.error) {
        handleRefreshFailure(api);
      }
    } catch {
      handleRefreshFailure(api);
    } finally {
      isRefreshing = false;
    }
  }

  if (isRefreshing) {
    await waitForRefresh();
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401 && TokenManager.isAuthenticated()) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResult = await performTokenRefresh(api, extraOptions);

        if (refreshResult.data) {
          result = await baseQuery(args, api, extraOptions);
        } else {
          handleRefreshFailure(api);
          return refreshResult;
        }
      } catch (error) {
        handleRefreshFailure(api);
        return { error };
      } finally {
        isRefreshing = false;
      }
    } else {
      await waitForRefresh();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export default fetchBaseQueryWithReauth;
export { TokenManager };
