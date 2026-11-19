"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCloudUploadAlt, FaEdit, FaTrashAlt, FaExternalLinkAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useAdminBlogsQuery, useDeleteBlogsMutation, useToggleBlogStatusMutation } from "@/redux/services/blogs/blogApi";
import ComponentLoader from "../Loader/ComponentLoader";
import EditBlogDrawer from "./EditBlogDrawer";

const Blogs = () => {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const scrollContainerRef = useRef(null);
  const sentinelRef = useRef(null);
  const loadLockRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, currentData, isLoading, isFetching, isError } = useAdminBlogsQuery({
    status,
    search: debouncedSearch,
    page,
  });
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogsMutation();
  const [toggleBlogStatus, { isLoading: isTogglingStatus }] = useToggleBlogStatusMutation();

  useEffect(() => {
    setPage(1);
    setBlogs([]);
    setIsFetchingMore(false);
    loadLockRef.current = false;
  }, [status, debouncedSearch]);

  useEffect(() => {
    if (!currentData?.results) return;
    setBlogs((previous) => {
      if (page === 1) return currentData.results;
      const existingIds = new Set(previous.map((blog) => blog.id));
      return [...previous, ...currentData.results.filter((blog) => !existingIds.has(blog.id))];
    });
    setIsFetchingMore(false);
    loadLockRef.current = false;
  }, [currentData, page]);

  const loadMore = useCallback(() => {
    if (!currentData?.next || isFetching || isFetchingMore || loadLockRef.current) return;
    loadLockRef.current = true;
    setIsFetchingMore(true);
    setPage((previous) => previous + 1);
  }, [currentData?.next, isFetching, isFetchingMore]);

  useEffect(() => {
    const root = scrollContainerRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel || !currentData?.next || isFetching || isFetchingMore || isError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { root, rootMargin: "0px 0px 140px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [currentData?.next, isFetching, isFetchingMore, isError, blogs.length, loadMore]);

  useEffect(() => {
    if (isError) {
      setIsFetchingMore(false);
      loadLockRef.current = false;
    }
  }, [isError]);

  const handleStatusChange = (nextStatus) => {
    setStatus(nextStatus);
    setPage(1);
    setBlogs([]);
  };

  const handleDelete = async (blogId) => {
    try {
      await deleteBlog(blogId).unwrap();
      setBlogs((previous) => previous.filter((blog) => blog.id !== blogId));
    } catch (error) {
      window.alert(error?.data?.message || "Could not delete this story.");
    }
  };

  const handleStatusToggle = async (blog) => {
    try {
      await toggleBlogStatus(blog.id).unwrap();
      const nextPublicState = !blog.is_public;
      if ((status === "published" && !nextPublicState) || (status === "draft" && nextPublicState)) {
        setBlogs((previous) => previous.filter((item) => item.id !== blog.id));
      } else {
        setBlogs((previous) => previous.map((item) => item.id === blog.id ? { ...item, is_public: nextPublicState } : item));
      }
    } catch (error) {
      window.alert(error?.data?.message || "Could not update this story.");
    }
  };

  const onEdit = (blog) => {
    setBlogToEdit(blog);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setBlogToEdit(null);
  }, []);

  if (isLoading && blogs.length === 0) return <ComponentLoader />;

  const loadedCount = blogs.length;
  const totalCount = data?.count ?? loadedCount;
  const hasMore = Boolean(currentData?.next);

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-stone-200 bg-[#fffdf9] p-4 shadow-sm sm:flex-row sm:items-center">
        <label className="group relative w-full sm:max-w-md">
          <span className="sr-only">Search stories</span>
          <IoSearch className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, excerpt, or category..."
            className="block w-full rounded-xl border border-stone-200 bg-[#faf9f6] py-3 pl-11 pr-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10"
          />
        </label>
        <div className="flex flex-wrap gap-2" aria-label="Filter stories by status">
          {["all", "published", "draft"].map((item) => (
            <button key={item} type="button" onClick={() => handleStatusChange(item)} aria-pressed={status === item} className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${status === item ? "bg-stone-900 text-white shadow-sm" : "border border-stone-200 bg-white text-stone-600 hover:bg-amber-50"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-stone-500">
        <span>{isFetching && blogs.length > 0 ? "Updating stories…" : `${loadedCount} of ${totalCount} stories loaded`}</span>
        <span className="hidden sm:inline">Scroll the list to load more</span>
      </div>

      {isError && blogs.length === 0 ? (
        <div className="rounded-2xl border border-rose-200 bg-[#fffdf9] p-10 text-center text-sm text-rose-700">Stories could not be loaded. Please refresh and try again.</div>
      ) : blogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-[#fffdf9] p-12 text-center">
          <FaCloudUploadAlt className="mx-auto text-4xl text-amber-800/40" />
          <p className="mt-3 font-serif text-xl text-stone-800">No stories found</p>
          <p className="mt-1 text-sm text-stone-500">Try another search or choose a different status.</p>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          onScroll={(event) => {
            const container = event.currentTarget;
            if (container.scrollTop + container.clientHeight >= container.scrollHeight - 140) loadMore();
          }}
          className="max-h-[calc(100dvh-370px)] min-h-[320px] overflow-auto overscroll-contain rounded-2xl border border-stone-200 bg-[#fffdf9] shadow-sm"
        >
          <table className="w-full min-w-[850px] border-separate border-spacing-0 text-left">
            <thead className="sticky top-0 z-10 bg-[#f5f1e9]">
              <tr>
                <th scope="col" className="border-b border-stone-200 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">Story</th>
                <th scope="col" className="border-b border-stone-200 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">Category</th>
                <th scope="col" className="border-b border-stone-200 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">Status</th>
                <th scope="col" className="border-b border-stone-200 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">Published</th>
                <th scope="col" className="border-b border-stone-200 px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {blogs.map((blog) => (
                <tr key={blog.id} className="group transition hover:bg-[#faf7f0]">
                  <td className="max-w-[430px] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-200">
                        {blog.image ? <Image src={blog.image} alt="" fill sizes="64px" className="object-cover" /> : <div className="h-full w-full bg-gradient-to-br from-amber-100 to-stone-200" />}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/blogs/${blog.slug}`} className="block truncate text-sm font-semibold text-stone-900 transition hover:text-amber-900">{blog.title}</Link>
                        <p className="mt-1 line-clamp-1 text-xs text-stone-500">{blog.excerpt || "No excerpt added yet."}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-950">{blog.category || "Uncategorized"}</span></td>
                  <td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${blog.is_public ? "bg-emerald-50 text-emerald-800" : "bg-stone-100 text-stone-600"}`}><span className={`h-1.5 w-1.5 rounded-full ${blog.is_public ? "bg-emerald-600" : "bg-stone-400"}`} />{blog.is_public ? "Published" : "Draft"}</span></td>
                  <td className="whitespace-nowrap px-4 py-4 text-xs text-stone-500">{blog.created_at ? new Date(blog.created_at).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" }) : "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/blogs/${blog.slug}`} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-stone-400 transition hover:bg-white hover:text-amber-900" aria-label={`View ${blog.title}`} title="View story"><FaExternalLinkAlt className="text-xs" /></Link>
                      <button type="button" onClick={() => onEdit(blog)} className="rounded-lg p-2 text-stone-500 transition hover:bg-white hover:text-amber-900" aria-label={`Edit ${blog.title}`} title="Edit story"><FaEdit className="text-sm" /></button>
                      <button type="button" onClick={() => handleStatusToggle(blog)} disabled={isTogglingStatus} className="rounded-lg px-2.5 py-2 text-[10px] font-semibold text-stone-600 transition hover:bg-white hover:text-amber-900 disabled:opacity-50" title={blog.is_public ? "Move to drafts" : "Publish story"}>{blog.is_public ? "Draft" : "Publish"}</button>
                      <button type="button" onClick={() => handleDelete(blog.id)} disabled={isDeleting} className="rounded-lg p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50" aria-label={`Delete ${blog.title}`} title="Delete story"><FaTrashAlt className="text-xs" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div ref={sentinelRef} className="flex min-h-14 items-center justify-center border-t border-stone-100 px-4 py-3 text-xs text-stone-500">
            {isFetchingMore || (isFetching && page > 1) ? <span className="inline-flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-800/20 border-t-amber-800" />Loading more stories…</span> : hasMore ? "Scroll for more stories" : "You’re all caught up"}
          </div>
        </div>
      )}

      {isDrawerOpen && <EditBlogDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} editBlog={blogToEdit} />}
    </div>
  );
};

export default Blogs;
