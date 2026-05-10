import { createApi } from "@reduxjs/toolkit/query/react";
import fetchBaseQueryWithReauth from "../fetchBaseQueryWithReauth";

export const agentApi = createApi({
  reducerPath: "agentApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    chat: builder.mutation({
      query: (data) => ({
        url: `/chatbot/`,
        method: "POST",
        body: data,
      }),
      providesTags: ["Chat"],
    }),
  }),
});

export const { useChatMutation } = agentApi;
