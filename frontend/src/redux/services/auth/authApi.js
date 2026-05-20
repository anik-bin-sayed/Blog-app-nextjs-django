import { createApi } from "@reduxjs/toolkit/query/react";
import fetchBaseQueryWithReauth from "../fetchBaseQueryWithReauth";
import TokenManager from "@/utils/tokenManager";
import { setAuth, setRole, setStatus, setUserId } from "./authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/accounts/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    activateAccount: builder.mutation({
      query: ({ uid, token }) => ({
        url: `/accounts/activate/${uid}/${token}/`,
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation({
      query: (data) => ({
        url: `/accounts/login`,
        method: "POST",
        body: data,
      }),
      // Handle login response to store tokens
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.access) {
            TokenManager.setAccessToken(data.access, data.expires_in || 3600);
          } else {
            TokenManager.markAccessTokenRefreshed(15 * 60);
          }
          if (data?.refresh) {
            TokenManager.setRefreshToken(data.refresh);
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: `/accounts/logout`,
        method: "POST",
      }),
      // Clear tokens after logout
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear tokens on successful logout
          TokenManager.clearAllTokens();
        } catch (error) {
          // Still clear tokens even if logout request fails
          TokenManager.clearAllTokens();
        }
      },
      invalidatesTags: ["Auth"],
    }),

    refresh: builder.mutation({
      query: () => ({
        url: `/accounts/refresh`,
        method: "POST",
      }),
      // Handle refresh response
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.access) {
            TokenManager.setAccessToken(data.access, data.expires_in || 3600);
          } else {
            TokenManager.markAccessTokenRefreshed(15 * 60);
          }
          if (data?.refresh) {
            TokenManager.setRefreshToken(data.refresh);
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
        }
      },
      invalidatesTags: ["Auth"],
    }),

    profile: builder.query({
      query: () => ({
        url: `/accounts/profile`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivateAccountMutation,
  useLoginMutation,
  useProfileQuery,
  useLogoutMutation,
  useRefreshMutation,
} = authApi;
