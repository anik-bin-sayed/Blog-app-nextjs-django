"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PiDotsThreeCircle } from "react-icons/pi";
import {
  useDeleteNotificationMutation,
  useMarkAsReadMutation,
  useNotificationLengthQuery,
  useNotificationListQuery,
} from "@/redux/services/blogs/notification";
import Action from "./Action";
import Link from "next/link";
import { useSelector } from "react-redux";
import useNotifications from "@/hooks/useNotifications";

const Notifications = () => {
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [filter, setFilter] = useState("all");

  const dropdownRef = useRef(null);
  const loaderRef = useRef(null);

  const { role, auth, userId } = useSelector((state) => state.auth);
  const isAdmin = role === "admin";

  useNotifications(auth && userId ? userId : null, setNotifications);

  const { data, isLoading, error } = useNotificationListQuery(undefined, {
    skip: !auth && !isAdmin,
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const { data: unreadNotificationLength } = useNotificationLengthQuery(auth, {
    skip: !auth && !isAdmin,
  });

  useEffect(() => {
    if (data?.results && Array.isArray(data.results)) {
      setNotifications(data.results);
      setNextPage(data.next);
    }
  }, [data]);

  useEffect(() => {
    const tab = searchParams.get("tab") || "all";
    setFilter(tab);
  }, [searchParams]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    return !n.is_read;
  });

  const loadMore = async () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);

    try {
      const response = await fetch(nextPage);
      const newData = await response.json();

      setNotifications((prev) => [
        ...prev,
        ...(Array.isArray(newData?.results) ? newData.results : []),
      ]);

      setNextPage(newData?.next || null);
    } catch (err) {
      console.error("Failed to load more", err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!loaderRef.current || !nextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.5 },
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [nextPage, loadingMore]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffMinutes = Math.floor((now - date) / 60000);
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24)
      return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  };

  const getAvatar = (name) => name?.charAt(0)?.toUpperCase() || "?";

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    setOpenDropdownId(null);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );

    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Mark as read failed", err);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n)),
      );
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    setOpenDropdownId(null);

    const previous = [...notifications];

    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await deleteNotification(id).unwrap();
    } catch (err) {
      console.error("Delete failed", err);
      setNotifications(previous);
    }
  };

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-yellow-500 animate-pulse font-medium">
          Loading notifications...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 bg-white px-6 py-3 rounded-full shadow-md">
          Failed to load notifications
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black">Notifications</h1>
            <p className="text-gray-500 mt-1 text-sm">
              You have{" "}
              <span className="font-semibold text-black">
                {unreadNotificationLength?.unread_count}
              </span>{" "}
              unread {unreadCount === 1 ? "notification" : "notifications"}
            </p>
          </div>
          <Action />
        </div>

        {/* FILTER */}
        <div className="flex gap-2 bg-white p-1 rounded-2xl w-fit mb-8 shadow-sm">
          <button
            onClick={() => router.push("/notifications?tab=all")}
            className={`px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
              filter === "all"
                ? "bg-white shadow-md text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                filter === "all"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {data?.count}
            </span>
          </button>

          <button
            onClick={() => router.push("/notifications?tab=unread")}
            className={`px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
              filter === "unread"
                ? "bg-white shadow-md text-indigo-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Unread
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                filter === "unread"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {unreadNotificationLength?.unread_count}
            </span>
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium">No notifications</p>
              <p className="text-gray-400 text-sm mt-1">All caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <Link
                key={n.id}
                href={`/blogs/${n.blog_slug}?comment=${n.comment_id}`}
                onClick={(e) => handleMarkAsRead(n.id, e)}
                className={`group relative flex gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                  n.is_read
                    ? "bg-white border border-gray-100"
                    : "bg-linear-to-r from-yellow-50 to-white border-l-4 border-yellow-500"
                }`}
              >
                <div
                  className={`relative shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    n.is_read
                      ? "bg-yellow-100 text-gray-500"
                      : "bg-yellow-300 text-black"
                  }`}
                >
                  {getAvatar(n.actor_name)}
                  {!n.is_read && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm font-medium leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                    {n.blog_title} • {n.comment}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-gray-400">
                      {formatTime(n.created_at)}
                    </span>
                  </div>
                </div>

                <div
                  ref={openDropdownId === n.id ? dropdownRef : null}
                  className="relative shrink-0"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDropdown(e, n.id);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <PiDotsThreeCircle className="w-5 h-5" />
                  </button>

                  {openDropdownId === n.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      {!n.is_read && (
                        <button
                          onClick={(e) => handleMarkAsRead(n.id, e)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteNotification(n.id, e)}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <span className="inline-block px-3 py-1 bg-white rounded-full">
            Current tab: {filter}
          </span>
        </div>

        {/* LOAD MORE */}
        {nextPage && (
          <div ref={loaderRef} className="py-6 text-center text-gray-500">
            {loadingMore ? "Loading..." : "Scroll for more"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
