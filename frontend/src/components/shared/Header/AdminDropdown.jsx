"use client";

import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/services/auth/authSlice";
import { useLogoutMutation } from "@/redux/services/auth/authApi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useNotificationListQuery } from "@/redux/services/blogs/notification";

const DashboardIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const BookmarkIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const AdminDropdown = ({ isProfileOpen, data, unreadNotificationLength }) => {
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutUser());
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100/50 transition-all duration-300 origin-top-right z-50 ${
        isProfileOpen
          ? "scale-100 opacity-100 translate-y-0"
          : "scale-95 opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <div className="absolute -top-1 right-4 w-3 h-3 rotate-45 bg-white border-l border-t border-gray-100/50"></div>

      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
              {(data?.full_name || data?.username)?.[0]?.toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg">
              {data?.full_name || data?.username}
            </h3>
            {data?.full_name && (
              <p className="text-xs text-gray-400">@{data?.username}</p>
            )}
            <p className="text-xs text-gray-500 truncate">{data?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {data?.role === "admin" ? "Administrator" : "Member"}
            </span>
          </div>
        </div>
      </div>

      <ul className="py-2 px-2 space-y-1">
        {data?.role === "admin" && (
          <>
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 group"
              >
                <span className="text-gray-400 group-hover:text-yellow-500 transition">
                  <DashboardIcon />
                </span>
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                href="/notifications"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-white shadow-sm hover:shadow-md hover:bg-yellow-50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 group-hover:text-yellow-500 text-lg transition">
                    <IoIosNotificationsOutline />
                  </span>
                  <span className="font-medium text-gray-700 group-hover:text-yellow-600 transition">
                    Notifications
                  </span>
                </div>

                <span className="min-w-6 h-6 px-2 flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full shadow-sm group-hover:bg-red-600 transition">
                  {unreadNotificationLength?.unread_count}
                </span>
              </Link>
            </li>
          </>
        )}

        {data?.role !== "admin" && (
          <li>
            <Link
              href="/saved-blog"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 group"
            >
              <span className="text-gray-400 group-hover:text-yellow-500 transition">
                <BookmarkIcon />
              </span>
              <span className="font-medium">Saved Blogs</span>
            </Link>
          </li>
        )}

        {/* Divider */}
        <li className="pt-2 mt-1 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 group"
          >
            <span className="text-red-400 group-hover:text-red-500 transition">
              <LogoutIcon />
            </span>
            <span className="font-medium">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminDropdown;
