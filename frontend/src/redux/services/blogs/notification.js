import { createApi } from "@reduxjs/toolkit/query/react";
import fetchBaseQueryWithReauth from "../fetchBaseQueryWithReauth";
import { markAssetError } from "next/dist/client/route-loader";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: ["Comment", "Notification"],
  endpoints: (builder) => ({
    notificationList: builder.query({
      query: () => ({
        url: `/notifications/`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: `/mark-all-as-read/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/mark-as-read/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `delete-notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    notificationLength: builder.query({
      query: () => ({
        url: `unread-count/`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    deleteAllNotification: builder.mutation({
      query: () => ({
        url: `delete-all-notifications/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useNotificationListQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useNotificationLengthQuery,
  useDeleteAllNotificationMutation,
} = notificationApi;
