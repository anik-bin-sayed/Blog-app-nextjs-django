import { useState, useRef, useEffect } from "react";
import { PiDotsThreeVertical } from "react-icons/pi";
import { IoCheckmarkDoneOutline, IoTrashOutline } from "react-icons/io5";

import {
  useDeleteAllNotificationMutation,
  useMarkAllAsReadMutation,
  useNotificationLengthQuery,
  useNotificationListQuery,
} from "@/redux/services/blogs/notification";
import { useSelector } from "react-redux";

const Action = ({ onMarkAllRead, onDeleteAll }) => {
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
      onMarkAllRead?.();
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
      onDeleteAll?.();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete all notifications", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full border border-stone-200 bg-[#fffdf9] p-2.5 text-stone-600 shadow-sm transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-900 focus:outline-none cursor-pointer"
        aria-label="Actions"
        aria-expanded={isOpen}
      >
        <PiDotsThreeVertical className="w-6 h-6 text-gray-600 " />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf9] shadow-xl animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="border-b border-stone-100 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">Manage notifications</div>
          <div className="p-1.5">
            <button
              onClick={handleMarkAllRead}
              disabled={isUnreadNotificationAvailable}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-stone-700 transition hover:bg-amber-50 hover:text-amber-950 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <IoCheckmarkDoneOutline className="text-lg text-amber-800" />
              <span>Mark all as read</span>
            </button>

            <button
              onClick={handleDeleteAll}
              disabled={isNotificationAvailable}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <IoTrashOutline className="text-lg" />
              <span>Delete all notifications</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Action;
