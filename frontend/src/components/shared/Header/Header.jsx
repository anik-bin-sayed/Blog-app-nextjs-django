"use client";

import Logo from "@/components/ui/Logo";
import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useProfileQuery } from "@/redux/services/auth/authApi";
import AdminDropdown from "./AdminDropdown";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, setRole, setStatus, setUserId } from "@/redux/services/auth/authSlice";
import BannedUserModal from "@/components/Modal/BannedAlertModal";
import GlobalLoader from "@/components/Loader/GlobalLoader";
import { IoIosNotifications } from "react-icons/io";
import { useNotificationLengthQuery } from "@/redux/services/blogs/notification";

const navLinks = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Stories", href: "/blogs" },
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
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isDashboardPage = pathname.startsWith("/dashboard");
  const { data, isLoading } = useProfileQuery(undefined, { skip: isAuthPage || isDashboardPage });
  const { data: unreadNotificationLength } = useNotificationLengthQuery(auth, { skip: !auth || isDashboardPage });

  useEffect(() => {
    if (!data) return;
    dispatch(setRole(data.role));
    dispatch(setStatus(data.is_banned));
    dispatch(setUserId(data.id));
    dispatch(setAuth(true));
  }, [data, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && setIsMenuOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  if (isDashboardPage) return null;
  if (data?.is_banned) return <BannedUserModal />;
  if (isLoading) return <GlobalLoader />;

  const isActive = (href) => href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const linkClass = (href) => `relative py-2 text-sm font-medium transition-colors duration-200 ${isActive(href) ? "text-amber-800" : "text-stone-600 hover:text-amber-800"}`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fffdf9]/95 shadow-[0_4px_24px_-18px_rgba(41,32,22,0.35)] backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Logo />

          <nav aria-label="Main navigation" className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <Link key={link.id} href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className={linkClass(link.href)}>
                {link.name}
                {isActive(link.href) && <span className="absolute inset-x-0 -bottom-[18px] h-0.5 rounded-full bg-amber-700" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {data?.id && data?.role === "admin" && (
              <Link href="/notifications" aria-label="Notifications" className="relative rounded-full p-2.5 text-stone-600 transition hover:bg-amber-50 hover:text-amber-800">
                <IoIosNotifications className="text-xl" />
                {!!unreadNotificationLength?.unread_count && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white">{unreadNotificationLength.unread_count}</span>}
              </Link>
            )}
            {data?.id ? (
              <div ref={profileRef} className="relative">
                <button type="button" onClick={() => setIsProfileOpen((open) => !open)} aria-label="Open profile menu" aria-expanded={isProfileOpen} className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-amber-100 text-sm font-bold uppercase text-amber-900 ring-2 ring-transparent transition hover:ring-amber-200">
                  {(data?.full_name || data?.username)?.[0]}
                </button>
                {isProfileOpen && <AdminDropdown isProfileOpen={isProfileOpen} data={data} unreadNotificationLength={unreadNotificationLength} />}
              </div>
            ) : (
              <Link href="/login" className="hidden rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-700 transition hover:border-amber-700 hover:bg-amber-50 hover:text-amber-900 sm:inline-flex">Log in</Link>
            )}
            <button type="button" onClick={() => setIsMenuOpen(true)} className="rounded-full p-2.5 text-stone-700 transition hover:bg-amber-50 md:hidden" aria-label="Open navigation menu" aria-expanded={isMenuOpen}>
              <FaBars size={19} />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button type="button" className="absolute inset-0 h-full w-full bg-stone-950/40 backdrop-blur-[2px]" onClick={() => setIsMenuOpen(false)} aria-label="Close navigation menu" />
          <aside className="absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col border-l border-stone-200 bg-[#fffdf9] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-5">
              <Logo />
              <button type="button" onClick={() => setIsMenuOpen(false)} className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900" aria-label="Close menu"><FaTimes size={18} /></button>
            </div>
            <nav aria-label="Mobile navigation" className="mt-7 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.id} href={link.href} onClick={() => setIsMenuOpen(false)} aria-current={isActive(link.href) ? "page" : undefined} className={`rounded-xl px-4 py-3.5 text-base font-medium transition ${isActive(link.href) ? "bg-amber-100 text-amber-950" : "text-stone-700 hover:bg-stone-100"}`}>
                  {link.name}
                </Link>
              ))}
            </nav>
            {!data?.id && <Link href="/login" onClick={() => setIsMenuOpen(false)} className="mt-auto rounded-full bg-stone-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-amber-800">Log in to your account</Link>}
            <p className="mt-auto border-t border-stone-200 pt-5 text-xs leading-relaxed text-stone-500">Thoughtful reads for curious minds.</p>
          </aside>
        </div>
      )}
    </>
  );
};

export default Header;
