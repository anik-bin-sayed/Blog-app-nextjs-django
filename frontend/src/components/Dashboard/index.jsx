"use client";

import { useState } from "react";
import AllUser from "./AllUser";
import Activity from "./Activity";
import Blogs from "./Blogs";
import CreateBlog from "./CreateBlog";
import DraftBlogs from "./DraftBlogs";
import { RxCross2 } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("activities");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);
  const closeSidebar = () => setMobileSidebarOpen(false);

  const getClassName = (section) => {
    return `w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer text-black ${
      activeSection === section
        ? "bg-yellow-400 text-black font-medium border-l-4 border-black"
        : "hover:bg-yellow-100"
    }`;
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0  mt-15 z-50  w-56 bg-gray-50 text-gray-800 flex flex-col shadow-xl
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="p-5 border-b border-amber-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-black">Dashboard</h1>
              <p className="text-xs text-gray-600 mt-1">Admin Panel</p>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden text-gray-500 hover:text-black"
              aria-label="Close menu"
            >
              <RxCross2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 py-10 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => {
                  setActiveSection("activities");
                  closeSidebar();
                }}
                className={getClassName("activities")}
              >
                Activity Log
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("blogs");
                  closeSidebar();
                }}
                className={getClassName("blogs")}
              >
                Blogs
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("users");
                  closeSidebar();
                }}
                className={getClassName("users")}
              >
                All Users
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("create");
                  closeSidebar();
                }}
                className={getClassName("create")}
              >
                Create Blogs
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("draft");
                  closeSidebar();
                }}
                className={getClassName("draft")}
              >
                Draft Blogs
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
          <p>Logged in as Admin</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 relative lg:ml-56">
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-20 left-1 z-45 p-2 bg-white rounded-md shadow-md hover:bg-gray-100 focus:outline-none"
          aria-label="Open menu"
        >
          <GiHamburgerMenu className="w-6 h-6 text-gray-700" />
        </button>

        <div className="lg:pt-0 pt-12">
          {activeSection === "blogs" && (
            <Blogs setActiveSection={setActiveSection} />
          )}
          {activeSection === "users" && <AllUser />}
          {activeSection === "activities" && <Activity />}
          {activeSection === "create" && <CreateBlog />}
          {activeSection === "draft" && <DraftBlogs />}
        </div>
      </main>
    </div>
  );
}
