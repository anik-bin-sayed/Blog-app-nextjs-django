import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import fetchBaseQueryWithReauth from "../fetchBaseQueryWithReauth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/accounts/register",
        method: "POST",
        body: data,
      }),
    }),

    activateAccount: builder.mutation({
      query: ({ uid, token }) => ({
        url: `/accounts/activate/${uid}/${token}/`,
        method: "POST",
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: `/accounts/login`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivateAccountMutation,
  useLoginMutation,
} = authApi;
