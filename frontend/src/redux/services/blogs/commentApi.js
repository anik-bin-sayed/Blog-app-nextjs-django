import { createApi } from "@reduxjs/toolkit/query/react";
import fetchBaseQueryWithReauth from "../fetchBaseQueryWithReauth";

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: ["Comment", "Blog"],
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (data) => ({
        url: `/comment/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Comment"],
    }),

    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comment/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Blog", id: arg.blogId },
      ],
    }),
  }),
});

export const { useCreateCommentMutation, useDeleteCommentMutation } =
  commentApi;
