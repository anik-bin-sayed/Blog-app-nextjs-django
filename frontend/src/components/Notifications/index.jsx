"use client";

import { useEffect, useRef, useState } from "react";
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

export function NotificationsLoader() {
  return (
    <div className="min-h-[70vh] bg-[#faf7f0] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="mb-8 h-3 w-40 rounded bg-stone-200" />
        <div className="mb-3 h-10 w-72 rounded bg-stone-200" />
        <div className="mb-9 h-4 w-64 rounded bg-stone-100" />
        <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-24 rounded-2xl border border-stone-200 bg-white" />)}</div>
      </div>
    </div>
  );
}

const Notifications = () => {
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [liveUnreadCount, setLiveUnreadCount] = useState(null);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [filter, setFilter] = useState("all");

  const dropdownRef = useRef(null);
  const loaderRef = useRef(null);

  const { role, auth, userId } = useSelector((state) => state.auth);
  const isAdmin = role === "admin";

  useNotifications(userId, setNotifications, setLiveUnreadCount);

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

  const unreadCount = liveUnreadCount ?? unreadNotificationLength?.unread_count ?? notifications.filter((n) => !n.is_read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    return !n.is_read;
  });

  const loadMore = async () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);

    try {
      const response = await fetch(nextPage, { credentials: "include" });
      if (!response.ok) throw new Error("Could not load more notifications");
      const newData = await response.json();

      setNotifications((prev) => {
        const existingIds = new Set(prev.map((notification) => notification.id));
        const nextNotifications = Array.isArray(newData?.results) ? newData.results : [];
        return [...prev, ...nextNotifications.filter((notification) => !existingIds.has(notification.id))];
      });

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

    const notification = notifications.find((item) => item.id === id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    if (notification && !notification.is_read) setLiveUnreadCount((count) => Math.max(0, (count ?? unreadCount) - 1));

    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Mark as read failed", err);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n)),
      );
      if (notification && !notification.is_read) setLiveUnreadCount((count) => (count ?? unreadCount) + 1);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    setOpenDropdownId(null);

    const previous = [...notifications];
    const deletedNotification = notifications.find((notification) => notification.id === id);

    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (deletedNotification && !deletedNotification.is_read) setLiveUnreadCount((count) => Math.max(0, (count ?? unreadCount) - 1));

    try {
      await deleteNotification(id).unwrap();
    } catch (err) {
      console.error("Delete failed", err);
      setNotifications(previous);
      if (deletedNotification && !deletedNotification.is_read) setLiveUnreadCount((count) => (count ?? unreadCount) + 1);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const queryActive = auth || isAdmin;

  if (!mounted) {
    return <NotificationsLoader />;
  }

  if (queryActive && isLoading) {
    return <NotificationsLoader />;
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
    <main className="min-h-[calc(100dvh-76px)] flex-1 bg-[#faf7f0] px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-5 border-b border-stone-200 pb-7 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Your activity</p>
            <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-stone-900 sm:text-5xl">Notifications</h1>
            <p className="mt-3 text-sm text-stone-600">You have <span className="font-semibold text-stone-900">{unreadCount}</span> unread {unreadCount === 1 ? "notification" : "notifications"}.</p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="rounded-xl border border-stone-200 bg-[#fffdf9] px-4 py-2.5 text-right shadow-sm">
              <span className="block font-serif text-xl leading-none text-stone-900">{data?.count ?? notifications.length}</span>
              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.14em] text-stone-500">Total</span>
            </div>
            <Action onMarkAllRead={() => setLiveUnreadCount(0)} onDeleteAll={() => { setNotifications([]); setLiveUnreadCount(0); }} />
          </div>
        </div>

        <div className="mb-7 flex w-fit gap-1 rounded-full border border-stone-200 bg-[#fffdf9] p-1 shadow-sm" role="tablist" aria-label="Notification filters">
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            onClick={() => router.push("/notifications?tab=all")}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              filter === "all"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            All
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
                filter === "all"
                  ? "bg-white/15 text-white"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {data?.count ?? notifications.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={filter === "unread"}
            onClick={() => router.push("/notifications?tab=unread")}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              filter === "unread"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Unread
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
                filter === "unread"
                  ? "bg-white/15 text-white"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              {unreadCount}
            </span>
          </button>
        </div>

        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-[#fffdf9] px-6 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-900"><PiDotsThreeCircle className="text-3xl" /></span>
              <p className="mt-4 font-serif text-2xl text-stone-900">{filter === "unread" ? "You’re all caught up." : "No notifications yet."}</p>
              <p className="mt-2 text-sm text-stone-500">New activity from your stories will show up here.</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <article key={n.id} className={`group relative flex gap-3 rounded-2xl border p-4 shadow-sm transition duration-200 hover:shadow-md sm:gap-4 sm:p-5 ${n.is_read ? "border-stone-200 bg-[#fffdf9]" : "border-amber-200 bg-[#fffdf9] ring-1 ring-amber-900/5"}`}>
                <Link href={`/blogs/${n.blog_slug || ""}${n.comment_id ? `?comment=${n.comment_id}` : ""}`} onClick={(e) => handleMarkAsRead(n.id, e)} className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                  <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${n.is_read ? "bg-stone-100 text-stone-500" : "bg-amber-100 text-amber-950"}`}>
                    {getAvatar(n.actor_name)}
                    {!n.is_read && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#fffdf9] bg-amber-700" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-relaxed text-stone-800">{n.message}</p>
                    {(n.blog_title || n.comment) && <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">{n.blog_title}{n.blog_title && n.comment ? " · " : ""}{n.comment}</p>}
                    <span className="mt-2 block text-[11px] font-medium text-stone-400">{formatTime(n.created_at)}</span>
                  </div>
                </Link>

                <div ref={openDropdownId === n.id ? dropdownRef : null} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      toggleDropdown(e, n.id);
                    }}
                    aria-label="Notification actions"
                    aria-expanded={openDropdownId === n.id}
                    className="rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                  >
                    <PiDotsThreeCircle className="h-5 w-5" />
                  </button>

                  {openDropdownId === n.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-stone-200 bg-[#fffdf9] shadow-xl"
                    >
                      {!n.is_read && (
                        <button
                          onClick={(e) => handleMarkAsRead(n.id, e)}
                          className="w-full px-4 py-2.5 text-left text-sm text-stone-700 transition hover:bg-amber-50 hover:text-amber-950"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteNotification(n.id, e)}
                          className="w-full border-t border-stone-100 px-4 py-2.5 text-left text-sm text-rose-700 transition hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        {/* LOAD MORE */}
        {nextPage && (
          <div ref={loaderRef} className="py-7 text-center text-xs text-stone-500">
            {loadingMore ? "Loading more activity…" : "Scroll for more"}
          </div>
        )}
      </div>
    </main>
  );
};

export default Notifications;
