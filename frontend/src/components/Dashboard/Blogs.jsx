"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaCloudUploadAlt } from "react-icons/fa";
import { useAdminBlogsQuery } from "@/redux/services/blogs/blogApi";
import AdminBlogCard from "../cards/AdminBlogCard";
import { IoSearch } from "react-icons/io5";
import ComponentLoader from "../Loader/ComponentLoader";
import EditBlogDrawer from "./EditBlogDrawer";

const initialFilterState = {
  page: 1,
  status: "all",
  search: "",
  category: "",
};
const Blogs = ({ setActiveSection }) => {
  const [filters, setFilters] = useState(initialFilterState);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);

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

  const onEdit = (blog) => {
    setBlogToEdit(blog);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setBlogToEdit(null);
  }, []);

  if (isLoading) return <ComponentLoader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto p-4 m-4 bg-white rounded-xl shadow mt-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoSearch className="h-5 w-5 text-gray-400" />
          </div>

          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
            className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded bg-white text-sm placeholder-gray-400
                           focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                           transition-all duration-200 ease-out
                           hover:border-gray-300 hover:shadow-sm outline-0"
          />
        </div>

        <div className="flex gap-2">
          {["all", "published", "draft"].map((item) => (
            <button
              key={item}
              onClick={() => handleStatusChange(item)}
              className={`px-4 py-1 rounded-md text-sm capitalize transition font-medium cursor-pointer ${
                filters.status === item
                  ? "bg-yellow-500 text-black  shadow"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto ">
        {data?.results?.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-xl">
            <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400" />
            <p>No blogs found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.results?.map((blog, index) => (
              <AdminBlogCard key={index} blog={blog} onEdit={onEdit} />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-2 py-10 flex-wrap">
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
      {isDrawerOpen && (
        <EditBlogDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          editBlog={blogToEdit}
        />
      )}
    </div>
  );
};

export default Blogs;
