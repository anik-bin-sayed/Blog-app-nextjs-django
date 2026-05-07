import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/auth/authApi";
import { blogApi } from "./services/blogs/blogApi";
import authReducer from "./services/auth/authSlice";
import { userApi } from "./services/user/userApi";
import { commentApi } from "./services/blogs/commentApi";
import { notificationApi } from "./services/blogs/notification";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      blogApi.middleware,
      userApi.middleware,
      commentApi.middleware,
      notificationApi.middleware,
    ),
});
