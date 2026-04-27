import { createApi } from "@reduxjs/toolkit/query/react";
import fetchBaseQueryWithReauth from "../fetchBaseQueryWithReauth";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: `/categories/`,
        method: "GET",
      }),
    }),

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

    adminBlogs: builder.query({
      query: ({ status, search, category, page } = {}) => {
        const params = {};

        if (status && status !== "all") {
          params.status = status;
        }

        if (search) {
          params.search = search;
        }

        if (category) {
          params.category = category;
        }

        if (page) {
          params.page = page;
        }

        return {
          url: `/admin/blogs/`,
          method: "GET",
          params,
        };
      },
    }),
  }),
});

export const {
  // categories
  useGetAllCategoriesQuery,

  // blogs
  useBlogListQuery,
  useBlogDetailsQuery,
  useFeaturedBlogsQuery,
  useRecentBlogsQuery,
  useAdminBlogsQuery,
} = blogApi;
