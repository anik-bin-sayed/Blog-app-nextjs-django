"use client";

import React from "react";
import Link from "next/link";
import { useLogoutMutation } from "@/redux/services/auth/authApi";

const AdminDropdown = ({ isProfileOpen, data }) => {
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`absolute right-0 mt-3 w-52 bg-white shadow-xl overflow-hidden transition-all duration-200 origin-top border border-gray-100 ${
        isProfileOpen
          ? "scale-100 opacity-100"
          : "scale-95 opacity-0 pointer-events-none"
      }`}
    >
      <Link
        href={"/profile"}
        className="flex items-center gap-3 px-4 py-3 border-b border-gray-100  bg-gray-50"
      >
        <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-semibold uppercase">
          {data?.username?.[0]}
        </div>

        {/* Info */}
        <div className="leading-tight">
          <p className="text-sm font-semibold text-gray-800">
            {data?.username}
          </p>
          <p className="text-xs text-gray-500 truncate w-28">{data?.email}</p>
        </div>
      </Link>

      <ul className="text-sm text-gray-700 py-1">
        <li>
          <Link
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100 transition rounded-md mx-1"
          >
            Profile
          </Link>
        </li>

        {data?.role === "admin" && (
          <li>
            <Link
              href="/dashboard"
              className="block px-4 py-2 hover:bg-gray-100 transition rounded-md mx-1"
            >
              Dashboard
            </Link>
          </li>
        )}

        {data?.role != "admin" && (
          <li>
            <Link
              href="/saved-blog"
              className="block px-4 py-2 hover:bg-gray-100 transition rounded-md mx-1"
            >
              Saved Blogs
            </Link>
          </li>
        )}

        <li className="border-t cursor-pointer border-gray-300 mt-1 pt-1">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 transition rounded-md mx-1 cursor-pointer"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminDropdown;
