import { createApi } from "@reduxjs/toolkit/query/react";
import fetchBaseQueryWithReauth from "../fetchBaseQueryWithReauth";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: `/accounts/users/`,
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/accounts/users/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getActivity: builder.query({
      query: () => ({
        url: `/accounts/activity/`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUserMutation, useGetActivityQuery } =
  userApi;
