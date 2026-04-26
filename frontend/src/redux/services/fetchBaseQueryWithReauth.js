import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { logout } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api",
  credentials: "include",
});

let isRefreshing = false;
let refreshPromise = null;

const fetchBaseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      refreshPromise = baseQuery(
        {
          url: "/accounts/refresh",
          method: "POST",
        },
        api,
        extraOptions,
      );

      const refreshResult = await refreshPromise;

      isRefreshing = false;

      if (!refreshResult?.data) {
        // api.dispatch(logout());
        return result;
      }
    } else {
      await refreshPromise;
    }

    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};

export default fetchBaseQueryWithReauth;
