"use client";

import Logo from "@/components/ui/Logo";
import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useProfileQuery } from "@/redux/services/auth/authApi";
import AdminDropdown from "./AdminDropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuth,
  setRole,
  setStatus,
  setUserId,
} from "@/redux/services/auth/authSlice";
import BannedUserModal from "@/components/Modal/BannedAlertModal";
import GlobalLoader from "@/components/Loader/GlobalLoader";
import { IoIosNotifications } from "react-icons/io";
import { useNotificationLengthQuery } from "@/redux/services/blogs/notification";

const navLinks = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Blogs", href: "/blogs" },
  { id: 3, name: "About", href: "/about" },
  { id: 4, name: "Contact", href: "/contact" },
];

const Header = () => {
  const { auth } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const pathname = usePathname();
  const profileRef = useRef(null);
  const dispatch = useDispatch();

  const isAuthPage =
    pathname === "/login" || pathname === "/register";

  const { data, isLoading } = useProfileQuery(undefined, {
    skip: isAuthPage,
  });

  const { data: unreadNotificationLength } = useNotificationLengthQuery(auth, {
    skip: !auth,
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    if (data) {
      dispatch(setRole(data.role));
      dispatch(setStatus(data.is_banned));
      dispatch(setUserId(data.id));
      dispatch(setAuth(true));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (data?.is_banned) return <BannedUserModal />;

  if (isLoading) return <GlobalLoader />;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-amber-600 border-b-2 border-amber-500"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {data?.id && data?.role == "admin" && (
              <Link
                href="/notifications"
                className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
              >
                <IoIosNotifications className="text-xl text-gray-600 group-hover:text-yellow-500 transition" />

                <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center text-[10px] font-semibold text-white bg-red-500 rounded-full">
                  {unreadNotificationLength?.unread_count}
                </span>
              </Link>
            )}
            {data?.id ? (
              <div className="flex gap-6">
                <div
                  onClick={toggleProfile}
                  ref={profileRef}
                  className="relative"
                >
                  <div className="w-10 h-10 rounded-full border bg-amber-600 flex items-center justify-center uppercase font-semibold text-md text-white cursor-pointer">
                    {(data?.full_name || data?.username)?.[0]}
                  </div>
                  {isProfileOpen && (
                    <AdminDropdown
                      isProfileOpen={isProfileOpen}
                      data={data}
                      unreadNotificationLength={unreadNotificationLength}
                    />
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 text-gray-600 hover:text-amber-600 transition-colors"
              >
                Login
              </Link>
            )}

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-amber-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fadeIn"
            onClick={closeMenu}
          />

          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 md:hidden flex flex-col p-6 animate-slideInRight">
            <button
              onClick={closeMenu}
              className="self-end p-2 text-gray-500 hover:text-amber-600 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col space-y-6 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={closeMenu}
                  className={`text-lg font-medium transition-colors ${
                    pathname === link.href
                      ? "text-amber-600 border-l-4 border-amber-500 pl-3"
                      : "text-gray-700 hover:text-amber-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
