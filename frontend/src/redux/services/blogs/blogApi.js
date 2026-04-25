import { createApi } from "@reduxjs/toolkit/query/react";
import fetchBaseQueryWithReauth from "../fetchBaseQueryWithReauth";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    blogList: builder.query({
      query: () => ({
        url: "/blogs/",
        method: "GET",
      }),
    }),

    blogDetails: builder.query({
      query: (slug) => ({
        url: `/blogs/${slug}/`,
        method: "GET",
      }),
    }),
  }),
});

export const { useBlogListQuery, useBlogDetailsQuery } = blogApi;
