"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import AllUser from "./AllUser";
import Activity from "./Activity";
import Blogs from "./Blogs";
import CreateBlog from "./CreateBlog";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowUpRightFromSquare, FaChartLine, FaFileLines, FaHouse, FaPenToSquare, FaUsers } from "react-icons/fa6";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "@/redux/services/auth/authApi";
import { logoutUser } from "@/redux/services/auth/authSlice";

const sections = [
  { id: "activities", label: "Overview", icon: FaChartLine, title: "Good to see you, Admin.", description: "Here’s what’s happening across your journal." },
  { id: "blogs", label: "Stories", icon: FaFileLines, title: "Manage your stories", description: "Review published posts, drafts, and updates." },
  { id: "users", label: "Readers", icon: FaUsers, title: "Your community", description: "Find readers and manage account access." },
  { id: "create", label: "Write a story", icon: FaPenToSquare, title: "Create something new", description: "Draft a fresh story for the Globira journal." },
];

const siteLinks = [
  { label: "Home", href: "/", icon: FaHouse },
  { label: "Stories", href: "/blogs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Notifications", href: "/notifications", icon: IoIosNotifications },
];

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const requestedSection = searchParams.get("tab") || "activities";
  const activeSection = sections.some((section) => section.id === requestedSection) ? requestedSection : "activities";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const currentSection = sections.find((section) => section.id === activeSection);

  const handleTabChange = (section) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", section);
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
    setMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(logoutUser());
      router.replace("/login");
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#f5f1e9] text-stone-900">
      <header className="relative z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-stone-200 bg-[#fffdf9] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileSidebarOpen(true)} className="rounded-full p-2 text-stone-600 transition hover:bg-amber-50 hover:text-amber-900 lg:hidden" aria-label="Open dashboard menu"><FaBars /></button>
          <Logo />
          <span className="hidden h-7 w-px bg-stone-200 sm:block" />
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 sm:block">Admin workspace</span>
        </div>
        <nav aria-label="Public site navigation" className="hidden items-center gap-6 lg:flex">
          {siteLinks.map(({ label, href }) => <Link key={href} href={href} className="text-xs font-medium text-stone-500 transition hover:text-amber-900">{label}</Link>)}
        </nav>
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-3.5 py-2 text-xs font-semibold text-stone-700 transition hover:border-amber-800 hover:bg-amber-50 hover:text-amber-950 sm:px-4">
          <span className="hidden sm:inline">View site</span><FaArrowUpRightFromSquare className="text-[10px]" />
        </Link>
      </header>

      <div className="flex min-h-0 flex-1">
        {mobileSidebarOpen && <button type="button" className="fixed inset-0 z-40 bg-stone-950/40 backdrop-blur-[2px] lg:hidden" onClick={() => setMobileSidebarOpen(false)} aria-label="Close dashboard menu" />}
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-[min(84vw,290px)] flex-col border-r border-stone-200 bg-[#fffdf9] shadow-2xl transition-transform duration-300 lg:static lg:z-10 lg:w-64 lg:shrink-0 lg:translate-x-0 lg:shadow-none ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-5 lg:hidden">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-900">Workspace</p><p className="mt-1 text-xs text-stone-500">Manage Globira</p></div>
            <button type="button" onClick={() => setMobileSidebarOpen(false)} className="rounded-full p-2 text-stone-500 hover:bg-stone-100" aria-label="Close menu"><FaTimes /></button>
          </div>
          <div className="hidden border-b border-stone-200 px-6 py-6 lg:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">Workspace</p>
            <p className="mt-1 font-serif text-xl text-stone-900">The journal desk</p>
          </div>
          <nav aria-label="Dashboard sections" className="flex-1 overflow-y-auto px-3 py-5">
            <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">Manage</p>
            <ul className="space-y-1.5">
              {sections.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button type="button" onClick={() => handleTabChange(id)} aria-current={activeSection === id ? "page" : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition ${activeSection === id ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:bg-amber-50 hover:text-amber-950"}`}>
                    <Icon className={`text-base ${activeSection === id ? "text-amber-200" : "text-stone-400"}`} /> {label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="my-6 border-t border-stone-200" />
            <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">Visit the site</p>
            <ul className="space-y-1">
              {siteLinks.map(({ label, href, icon: Icon }) => (
                <li key={href}><Link href={href} onClick={() => setMobileSidebarOpen(false)} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-stone-600 transition hover:bg-amber-50 hover:text-amber-950">{Icon ? <Icon className="text-sm text-stone-400" /> : <span className="w-3.5" />}{label}<FaArrowUpRightFromSquare className="ml-auto text-[9px] text-stone-300" /></Link></li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-stone-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xs font-bold uppercase text-amber-950">A</span>
              <div><p className="text-xs font-semibold text-stone-800">Administrator</p><p className="mt-0.5 text-[10px] text-stone-500">Globira journal</p></div>
            </div>
            <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="mt-4 w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-left text-xs font-semibold text-stone-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-800 disabled:opacity-50">{isLoggingOut ? "Signing out…" : "Sign out"}</button>
          </div>
        </aside>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
            <div className="mb-7 flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 sm:mb-8 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">Admin dashboard</p>
                <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">{currentSection.title}</h1>
                <p className="mt-2 text-sm text-stone-500">{currentSection.description}</p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-stone-200 bg-[#fffdf9] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Admin session</span>
            </div>

            {activeSection === "blogs" && <Blogs />}
            {activeSection === "users" && <AllUser />}
            {activeSection === "activities" && <Activity />}
            {activeSection === "create" && <CreateBlog />}
          </div>
        </main>
      </div>
    </div>
  );
}
