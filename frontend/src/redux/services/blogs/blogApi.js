import { createApi } from "@reduxjs/toolkit/query/react";
import fetchBaseQueryWithReauth from "../fetchBaseQueryWithReauth";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    blogList: builder.query({
      query: (params) => ({
        url: `/blogs/`,
        method: "GET",
        params,
      }),
    }),

    blogDetails: builder.query({
      query: (slug) => ({
        url: `/blogs/${slug}/`,
        method: "GET",
      }),
    }),

    featuredBlogs: builder.query({
      query: () => ({
        url: `/featured/`,
        method: "GET",
      }),
    }),

    recentBlogs: builder.query({
      query: () => ({
        url: `/recent/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useBlogListQuery,
  useBlogDetailsQuery,
  useFeaturedBlogsQuery,
  useRecentBlogsQuery,
} = blogApi;
