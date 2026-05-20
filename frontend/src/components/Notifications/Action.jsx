import React, { useState, useRef, useEffect } from "react";
import { PiDotsThreeVertical } from "react-icons/pi";

import {
  useDeleteAllNotificationMutation,
  useMarkAllAsReadMutation,
  useNotificationLengthQuery,
  useNotificationListQuery,
} from "@/redux/services/blogs/notification";
import { useSelector } from "react-redux";

const Action = () => {
  const { auth } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteAllNotification] = useDeleteAllNotificationMutation();
  const { data: unreadNotificationLength } = useNotificationLengthQuery(auth, {
    skip: !auth,
  });
  const { data, refetch } = useNotificationListQuery(auth, {
    skip: !auth,
  });

  const isUnreadNotificationAvailable =
    unreadNotificationLength?.unread_count == 0;

  const isNotificationAvailable = data?.count <= 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
      refetch();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL notifications? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await deleteAllNotification().unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete all notifications", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none cursor-pointer"
        aria-label="Actions"
      >
        <PiDotsThreeVertical className="w-6 h-6 text-gray-600 " />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="py-1">
            <button
              onClick={handleMarkAllRead}
              disabled={isUnreadNotificationAvailable}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Mark all as read</span>
            </button>

            <button
              onClick={handleDeleteAll}
              disabled={isNotificationAvailable}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Delete all notifications</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Action;
