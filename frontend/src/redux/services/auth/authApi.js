import { createApi } from "@reduxjs/toolkit/query/react";
import fetchBaseQueryWithReauth from "../fetchBaseQueryWithReauth";

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
      invalidatesTags: ["Auth"],
    }),

    profile: builder.query({
      query: () => ({
        url: `/accounts/profile`,
        method: "GET",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivateAccountMutation,
  useLoginMutation,
  useProfileQuery,
} = authApi;
