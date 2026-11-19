"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useBlogListQuery,
  useGetAllCategoriesQuery,
  useSavedBlogsListQuery,
  useSavedBlogsMutation,
} from "@/redux/services/blogs/blogApi";
import Card from "../cards/card";
import { IoSearch, IoFilterOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineSearch } from "react-icons/hi";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { TbCategory } from "react-icons/tb";
import { useSelector } from "react-redux";

const pageSize = 16;

function StorySkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="aspect-[1.45/1] animate-pulse bg-stone-200" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-1/3 animate-pulse rounded bg-stone-200" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-stone-200" />
            <div className="h-3 w-full animate-pulse rounded bg-stone-100" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-stone-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AllBlogs() {
  const { auth, role } = useSelector((state) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const ordering = searchParams.get("ordering") || "-created_at";
  const categoryParam = searchParams.get("category") || "";
  const [localSaved, setLocalSaved] = useState(new Set());
  const [tempSearch, setTempSearch] = useState(search);
  const [category, setCategory] = useState(categoryParam);

  useEffect(() => {
    setTempSearch(search);
    setCategory(categoryParam);
  }, [search, categoryParam]);

  const { data, isLoading, isError } = useBlogListQuery(
    { page, search, ordering, category },
    { refetchOnMountOrArgChange: true },
  );
  const { data: categories } = useGetAllCategoriesQuery();
  const [savedBlogs] = useSavedBlogsMutation();
  const { data: savedPosts } = useSavedBlogsListQuery(auth, { skip: !auth });

  const posts = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNext = !!data?.next;
  const hasPrev = !!data?.previous;

  const updateURL = useCallback(
    (newPage, newSearch, newOrdering, newCategory = category) => {
      const params = new URLSearchParams();
      if (newPage && newPage !== 1) params.set("page", newPage);
      if (newSearch) params.set("search", newSearch);
      if (newOrdering && newOrdering !== "-created_at") params.set("ordering", newOrdering);
      if (newCategory) params.set("category", newCategory);
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : window.location.pathname, { scroll: false });
    },
    [router, category],
  );

  const handleSearchSubmit = () => updateURL(1, tempSearch.trim(), ordering);
  const handleClearSearch = () => {
    setTempSearch("");
    updateURL(1, "", ordering);
  };
  const handleOrderingChange = (value) => updateURL(1, search, value);
  const handleCategoryChange = (value) => {
    setCategory(value);
    updateURL(1, search, ordering, value);
  };
  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    updateURL(newPage, search, ordering);
    document.getElementById("all-stories")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const resetAllFilters = () => {
    setTempSearch("");
    setCategory("");
    updateURL(1, "", "-created_at", "");
  };

  const savedIds = new Set(savedPosts?.map((item) => item.id) || []);
  const finalSavedIds = new Set([...savedIds, ...localSaved]);

  const handleSaveClick = async (id) => {
    const wasSaved = finalSavedIds.has(id);
    if (!wasSaved && finalSavedIds.size >= 8) {
      alert("Max 8 saved blogs");
      return;
    }
    setLocalSaved((previous) => {
      const next = new Set(previous);
      wasSaved ? next.delete(id) : next.add(id);
      return next;
    });
    try {
      await savedBlogs(id).unwrap();
    } catch (error) {
      alert(error?.data?.message || "Could not update your saved stories.");
      setLocalSaved((previous) => {
        const next = new Set(previous);
        wasSaved ? next.add(id) : next.delete(id);
        return next;
      });
    }
  };

  return (
    <section id="all-stories" className="scroll-mt-24 bg-[#faf7f0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">The collection</p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">Explore the <span className="italic text-amber-800">archive</span></h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Browse every story, or follow a thought that catches your eye.</p>
          </div>
          {!isLoading && <p className="text-sm text-stone-500">{totalCount} {totalCount === 1 ? "story" : "stories"}</p>}
        </div>

        <div className="mb-9 rounded-2xl border border-stone-200 bg-white p-3 shadow-[0_12px_35px_-28px_rgba(41,32,22,0.4)] sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_190px_190px_auto]">
            <div className="relative">
              <IoSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-stone-400" />
              <input
                type="search"
                value={tempSearch}
                onChange={(event) => setTempSearch(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSearchSubmit()}
                placeholder="Search stories, topics, or ideas..."
                className="h-12 w-full rounded-xl border border-stone-200 bg-[#faf9f6] pl-11 pr-10 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10"
                aria-label="Search stories"
              />
              {tempSearch && <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-stone-400 transition hover:bg-stone-200 hover:text-stone-800" aria-label="Clear search"><RxCross1 className="text-xs" /></button>}
            </div>
            <label className="relative">
              <TbCategory className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-stone-400" />
              <select value={category} onChange={(event) => handleCategoryChange(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-stone-200 bg-[#faf9f6] pl-10 pr-8 text-sm text-stone-700 outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" aria-label="Filter by category">
                <option value="">All categories</option>
                {categories?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="relative">
              <IoFilterOutline className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-stone-400" />
              <select value={ordering} onChange={(event) => handleOrderingChange(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-stone-200 bg-[#faf9f6] pl-10 pr-8 text-sm text-stone-700 outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" aria-label="Sort stories">
                <option value="-created_at">Newest first</option>
                <option value="created_at">Oldest first</option>
              </select>
            </label>
            <button type="button" onClick={handleSearchSubmit} className="h-12 rounded-xl bg-stone-900 px-6 text-sm font-semibold text-white transition hover:bg-amber-900 focus:outline-none focus:ring-4 focus:ring-amber-700/20">Search stories</button>
          </div>

          {(search || category || ordering !== "-created_at") && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-stone-100 px-1 pt-3 text-xs text-stone-500">
              <span className="mr-1 font-medium text-stone-600">Showing:</span>
              {search && <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-900">“{search}”</span>}
              {category && <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-900">{categories?.find((item) => String(item.id) === String(category))?.name || "Selected category"}</span>}
              {ordering !== "-created_at" && <span className="rounded-full bg-stone-100 px-3 py-1.5 text-stone-700">Oldest first</span>}
              <button type="button" onClick={resetAllFilters} className="ml-auto font-semibold text-amber-800 transition hover:text-amber-950">Clear filters</button>
            </div>
          )}
        </div>

        {isLoading ? <StorySkeleton /> : isError ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center">
            <p className="font-serif text-2xl text-stone-900">The stories couldn’t load just now.</p>
            <p className="mt-2 text-sm text-stone-500">Please try again in a moment.</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white/70 px-6 py-16 text-center">
            <HiOutlineSearch className="mx-auto text-4xl text-stone-400" />
            <h3 className="mt-4 font-serif text-2xl text-stone-900">No stories found</h3>
            <p className="mt-2 text-sm text-stone-500">Try a different search or clear your filters.</p>
            <button type="button" onClick={resetAllFilters} className="mt-5 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-900">Clear filters</button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((post) => <Card key={post.id} post={post} role={role} onSave={handleSaveClick} savedButton isSaved={savedIds.has(post.id)} />)}
            </div>
            {totalPages > 1 && (
              <nav aria-label="Story pages" className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <button type="button" onClick={() => goToPage(page - 1)} disabled={!hasPrev} className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-amber-800 hover:text-amber-900 disabled:cursor-not-allowed disabled:opacity-40"><GrFormPreviousLink className="text-lg" /> Previous</button>
                <span className="text-sm text-stone-600">Page <strong className="mx-1 text-stone-900">{page}</strong> of <strong className="text-stone-900">{totalPages}</strong></span>
                <button type="button" onClick={() => goToPage(page + 1)} disabled={!hasNext} className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-amber-800 hover:text-amber-900 disabled:cursor-not-allowed disabled:opacity-40">Next <GrFormNextLink className="text-lg" /></button>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}
