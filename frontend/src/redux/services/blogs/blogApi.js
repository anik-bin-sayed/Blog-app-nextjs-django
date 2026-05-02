import { createApi } from "@reduxjs/toolkit/query/react";
import fetchBaseQueryWithReauth from "../fetchBaseQueryWithReauth";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: ["Blog", "Category"],
  endpoints: (builder) => ({
    // categories
    getAllCategories: builder.query({
      query: () => ({
        url: `/categories/`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: `/categories/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    // blogs
    blogList: builder.query({
      query: (params) => ({
        url: `/blogs/`,
        method: "GET",
        params,
      }),
      providesTags: ["Blog"],
    }),

    createBlog: builder.mutation({
      query: (data) => ({
        url: `/blog/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    blogDetails: builder.query({
      query: (slug) => ({
        url: `/blogs/${slug}/`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [{ type: "Blog", id: slug }],
    }),

    featuredBlogs: builder.query({
      query: () => ({
        url: `/featured/`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    recentBlogs: builder.query({
      query: () => ({
        url: `/recent/`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    deleteBlogs: builder.mutation({
      query: (id) => ({
        url: `blog/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    toggleBlogStatus: builder.mutation({
      query: (id) => ({
        url: `blog/toggle-status/${id}/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Blog"],
    }),

    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `blog/edit/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Blog"],
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
      providesTags: ["Blog"],
    }),
  }),
});

export const {
  // categories
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  // blogs
  useBlogListQuery,
  useBlogDetailsQuery,
  useFeaturedBlogsQuery,
  useRecentBlogsQuery,
  useAdminBlogsQuery,
  useCreateBlogMutation,
  useDeleteBlogsMutation,
  useToggleBlogStatusMutation,
  useUpdateBlogMutation,
} = blogApi;
