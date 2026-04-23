import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api",
  credentials: "include",
});

const fetchBaseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result?.error?.status === 401) {
    refreshToken = await baseQuery(
      {
        url: "/accounts/refresh",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshToken?.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export default fetchBaseQueryWithReauth;
