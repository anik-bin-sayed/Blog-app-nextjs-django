"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useBlogListQuery,
  useGetAllCategoriesQuery,
} from "@/redux/services/blogs/blogApi";
import Card from "../cards/card";
import CardLoader from "../utils/CardLoader";
import { IoSearch, IoFilterOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { FcSearch } from "react-icons/fc";
import { HiOutlineSearch } from "react-icons/hi";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { TbCategory } from "react-icons/tb";

const AllBlogs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const ordering = searchParams.get("ordering") || "-created_at";

  const [tempSearch, setTempSearch] = useState(search);
  const [category, setCategory] = useState("");

  const { data, isLoading } = useBlogListQuery(
    { page, search, ordering, category },
    { refetchOnMountOrArgChange: true },
  );
  const { data: categories } = useGetAllCategoriesQuery();

  const posts = data?.results || [];
  const totalCount = data?.count || 0;
  const pageSize = 16;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNext = !!data?.next;
  const hasPrev = !!data?.previous;

  const updateURL = useCallback(
    (newPage, newSearch, newOrdering) => {
      const params = new URLSearchParams();
      if (newPage && newPage !== 1) params.set("page", newPage);
      if (newSearch) params.set("search", newSearch);
      if (newOrdering && newOrdering !== "-created_at")
        params.set("ordering", newOrdering);
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : window.location.pathname, {
        scroll: false,
      });
    },
    [router],
  );

  const handleSearchSubmit = useCallback(() => {
    if (tempSearch === search) return;
    updateURL(1, tempSearch, ordering);
  }, [tempSearch, search, ordering, updateURL]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const handleClearSearch = () => {
    if (tempSearch || search) {
      setTempSearch("");
      updateURL(1, "", ordering);
    }
  };

  const handleOrderingChange = (value) => {
    updateURL(1, search, value);
  };

  const goToPage = (newPage) => {
    if (newPage === page) return;
    updateURL(newPage, search, ordering);
  };

  const resetAllFilters = () => {
    setTempSearch("");
    updateURL(1, "", "-created_at");
  };

  if (isLoading) {
    return (
      <CardLoader
        title="All"
        description="Explore all my articles, stories, and insights"
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
          All{" "}
          <span className="text-amber-600 relative inline-block">
            Stories
            <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-200 rounded-full -mb-2"></span>
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
          Explore all my articles, stories, and insights
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by title, category, content or excerpt..."
              className="w-full pl-11 pr-10 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-amber-800 placeholder:text-gray-400 outline-0"
              aria-label="Search blogs"
            />
            {tempSearch && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
                aria-label="Clear search"
              >
                <RxCross1 />
              </button>
            )}
          </div>

          <button
            onClick={handleSearchSubmit}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-all duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer"
          >
            Search
          </button>

          {/* category */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 text-sm font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="">All</option>
              {categories &&
                categories.map((category) => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
            </select>
            <TbCategory className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg" />
          </div>
          {/* ordering */}
          <div className="relative">
            <select
              value={ordering}
              onChange={(e) => handleOrderingChange(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 text-sm font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="-created_at"> Newest first</option>
              <option value="created_at"> Oldest first</option>
            </select>
            <IoFilterOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg" />
          </div>
        </div>

        {(search || ordering !== "-created_at") && (
          <div className="mt-3 text-sm text-gray-500 flex flex-wrap items-center gap-2">
            {search && (
              <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700 flex gap-2 items-center">
                <FcSearch />
                Search: <strong>{search}</strong>
              </span>
            )}
            {ordering !== "-created_at" && (
              <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                {ordering === "created_at" ? "Oldest first" : "Newest first"}
              </span>
            )}
            <button
              onClick={resetAllFilters}
              className="text-blue-600 hover:text-blue-800 text-xs hover:underline ml-2 cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <div className="text-6xl mb-4  flex items-center justify-center">
            <HiOutlineSearch />
          </div>
          <h3 className="text-xl font-semibold text-gray-700">
            No blogs found
          </h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post, index) => (
              <Card key={index} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={!hasPrev}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm flex items-center gap-2 hover:border hover:border-amber-700 cursor-pointer"
              >
                <GrFormPreviousLink />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Page</span>
                <strong className="px-3 py-1 bg-gray-100 rounded-lg text-gray-800 text-sm">
                  {page}
                </strong>
                <span className="text-sm text-gray-600">of {totalPages}</span>
              </div>

              <button
                onClick={() => goToPage(page + 1)}
                disabled={!hasNext}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm flex items-center gap-2 hover:border hover:border-amber-700 cursor-pointer"
              >
                Next <GrFormNextLink />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllBlogs;
