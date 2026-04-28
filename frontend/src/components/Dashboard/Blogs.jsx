"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaCloudUploadAlt } from "react-icons/fa";
import { useAdminBlogsQuery } from "@/redux/services/blogs/blogApi";
import AdminBlogCard from "../cards/AdminBlogCard";

const Blogs = ({ setActiveSection }) => {
  const [filters, setFilters] = useState({
    page: 1,
    status: "all",
    search: "",
    category: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  const { data, isLoading } = useAdminBlogsQuery({
    status: filters.status,
    search: debouncedSearch,
    category: filters.category,
    page: filters.page,
  });

  const handleStatusChange = (status) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const goToPage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const pageSize = data?.results?.length || 6;
  const totalPages = data?.count ? Math.ceil(data.count / pageSize) : 1;

  const currentPage = filters.page;

  const getPages = () => {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);

    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-yellow-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Blog Studio
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage, filter and publish your content efficiently
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-sm text-gray-500">
              Total: <span className="font-semibold">{data?.count || 0}</span>
            </div>

            <button
              onClick={() => setActiveSection("create")}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow transition"
            >
              <FaPlus />
              New Blog
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 m-4 bg-white rounded-xl shadow mt-6 flex flex-col sm:flex-row justify-between gap-4">
        <input
          type="text"
          placeholder="Search blogs..."
          value={filters.search}
          onChange={handleSearchChange}
          className="border px-4 py-2 rounded-lg w-full sm:w-80 focus:ring-2 focus:ring-yellow-400 outline-none"
        />

        <div className="flex gap-2">
          {["all", "published", "draft"].map((item) => (
            <button
              key={item}
              onClick={() => handleStatusChange(item)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${
                filters.status === item
                  ? "bg-yellow-500 text-white shadow"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {data?.results?.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-xl">
            <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400" />
            <p>No blogs found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.results?.map((blog, index) => (
              <AdminBlogCard key={index} blog={blog} />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-2 pb-10 flex-wrap">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={!data?.previous}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {getPages().map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!data?.next}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Blogs;
