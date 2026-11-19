"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/services/auth/authSlice";
import { useLogoutMutation } from "@/redux/services/auth/authApi";
import { IoIosNotificationsOutline } from "react-icons/io";

const DashboardIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6m-6 0v-4a1 1 0 011-1h2a1 1 0 011 1v4" />
  </svg>
);

const BookmarkIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const LogoutIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M10 17l5-5-5-5m5 5H3m9-9h5a2 2 0 012 2v14a2 2 0 01-2 2h-5" />
  </svg>
);

export default function AdminDropdown({ data, unreadNotificationLength }) {
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();
  const isAdmin = data?.role === "admin";
  const unreadCount = Number(unreadNotificationLength?.unread_count || 0);

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
    <div className="absolute right-0 z-50 mt-3 w-[min(360px,calc(100vw-24px))] origin-top-right overflow-visible rounded-[1.4rem] border border-stone-200/90 bg-[#fffdf9]/95 text-stone-800 shadow-[0_24px_70px_-28px_rgba(41,32,22,0.38)] backdrop-blur-xl transition duration-200">
      <span aria-hidden="true" className="absolute -top-2 right-5 h-4 w-4 rotate-45 rounded-tl border-l border-t border-stone-200/90 bg-[#fffdf9]" />

      <div className="relative flex items-center gap-4 border-b border-stone-200/80 px-5 py-5">
        <div className="relative shrink-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-xl font-bold uppercase text-white shadow-[0_8px_18px_-8px_rgba(194,94,0,0.65)]">
            {(data?.full_name || data?.username || "U")[0]?.toUpperCase()}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-[3px] border-[#fffdf9] bg-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[15px] font-bold tracking-tight text-stone-900">{data?.full_name || data?.username || "Reader"}</h2>
          {data?.full_name && <p className="mt-0.5 truncate text-xs text-stone-500">@{data?.username}</p>}
          <p className="mt-1 truncate text-xs text-stone-500">{data?.email}</p>
          <span className="mt-2 inline-flex rounded-full border border-stone-200 bg-stone-100/80 px-2.5 py-1 text-[10px] font-semibold text-stone-600">
            {isAdmin ? "Administrator" : "Member"}
          </span>
        </div>
      </div>

      <nav aria-label="Account navigation" className="space-y-1.5 p-2.5">
        {isAdmin ? (
          <>
            <Link href="/dashboard" className="group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-stone-700 transition hover:bg-amber-50 hover:text-amber-950">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-500 transition group-hover:bg-amber-100 group-hover:text-amber-900"><DashboardIcon /></span>
              <span className="flex-1">Dashboard</span>
              <svg aria-hidden="true" className="h-4 w-4 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/notifications" className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm font-medium text-stone-700 shadow-[0_5px_14px_-12px_rgba(41,32,22,0.5)] transition hover:border-amber-200 hover:bg-amber-50/70">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-800 transition group-hover:bg-amber-100"><IoIosNotificationsOutline className="text-xl" /></span>
              <span className="flex-1">Notifications</span>
              {unreadCount > 0 && <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-600 px-2 text-[11px] font-bold text-white shadow-sm">{unreadCount > 99 ? "99+" : unreadCount}</span>}
              {unreadCount === 0 && <span className="text-[10px] font-medium text-stone-400">All caught up</span>}
            </Link>
          </>
        ) : (
          <Link href="/saved-blog" className="group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-stone-700 transition hover:bg-amber-50 hover:text-amber-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-500 transition group-hover:bg-amber-100 group-hover:text-amber-900"><BookmarkIcon /></span>
            <span className="flex-1">Saved stories</span>
            <svg aria-hidden="true" className="h-4 w-4 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </Link>
        )}
      </nav>

      <div className="border-t border-stone-200/80 p-2.5">
        <button type="button" onClick={handleLogout} disabled={isLoading} className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition group-hover:bg-rose-100"><LogoutIcon /></span>
          <span>{isLoading ? "Signing out…" : "Log out"}</span>
        </button>
      </div>
    </div>
  );
}
