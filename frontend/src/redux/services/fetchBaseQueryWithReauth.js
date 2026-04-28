import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { logout } from "../features/auth/authSlice";

let isRefreshing = false;
let pendingRequests = [];

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    return headers;
  },
});

const refreshToken = async (api, extraOptions) => {
  const silentBaseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
    credentials: "include",
  });
  return await silentBaseQuery(
    { url: "/accounts/refresh", method: "POST" },
    api,
    extraOptions,
  );
};

const fetchBaseQueryWithReauth = async (args, api, extraOptions) => {
  const makeRequest = () => baseQuery(args, api, extraOptions);
  let result = await makeRequest();

  const isRefreshRequest = args.url === "/accounts/refresh";

  if (result?.error?.status === 401 && !isRefreshRequest) {
    if (!isRefreshing) {
      isRefreshing = true;

      const refreshResult = await refreshToken(api, extraOptions);

      isRefreshing = false;

      if (refreshResult?.error) {
        pendingRequests.forEach(({ reject }) => reject(refreshResult.error));
        pendingRequests = [];
        // api.dispatch(logout());
        return refreshResult;
      }

      await Promise.all(
        pendingRequests.map(({ resolve }) => resolve(makeRequest())),
      );
      pendingRequests = [];

      return await makeRequest();
    } else {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      });
    }
  }

  return result;
};

export default fetchBaseQueryWithReauth;
