"use client";

import {
  useSavedBlogsListQuery,
  useSavedBlogsMutation,
} from "@/redux/services/blogs/blogApi";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaBookmark,
  FaRegBookmark,
  FaRegClock,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";

const SavedBlog = () => {
  const { data: savedPosts, isLoading, isError } = useSavedBlogsListQuery();
  const [savedBlogs] = useSavedBlogsMutation();

  const handleUnsave = async (postId) => {
    try {
      await savedBlogs(postId).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-indigo-50/40 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse"></div>
            <div className="h-5 w-96 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
          </div>
          {/* Grid skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-red-100">
          <div className="text-red-500 text-5xl flex justify-center mb-4">
            <IoWarningOutline />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Failed to load saved blogs
          </h2>
          <p className="text-gray-600 mb-6">
            Please try again later or refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-yellow-400 text-black rounded-xl hover:bg-yellow-500 transition"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const hasSavedPosts = savedPosts && savedPosts.length > 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-indigo-50/30 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center justify-center p-2 bg-amber-100 rounded-full mb-4">
            <FaBookmark className="text-amber-600 text-xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Your Saved{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
              Collection
            </span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            All the articles you've bookmarked for later reading, neatly
            organized.
          </p>
        </div>

        {!hasSavedPosts ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 bg-white/50 rounded-3xl border border-dashed border-gray-200 backdrop-blur-sm">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-5">
              <FaRegBookmark className="text-amber-400 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No saved blogs yet
            </h3>
            <p className="text-gray-500 text-center max-w-sm mb-6">
              When you find an interesting article, click the bookmark icon to
              save it here.
            </p>
            <Link
              href="/blogs"
              className="px-6 py-2.5 bg-linear-to-r from-yellow-400 to-yellow-500 text-black rounded-xl font-medium shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              Explore Blogs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {savedPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:border-amber-200 relative"
              >
                {/* Remove button (optional) */}
                <button
                  onClick={() => handleUnsave(post.id)}
                  className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-red-50 transition-all duration-200 group-hover:opacity-100 focus:outline-none"
                  aria-label="Remove from saved"
                >
                  <FaBookmark className="text-amber-600 w-4 h-4" />
                </button>

                <Link href={`/blogs/${post.slug}`} className="flex-1">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        <MdOutlineDescription className="text-6xl text-amber-400" />
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        {post.category}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <FaRegCalendarAlt className="text-amber-400" />
                        <span>
                          {post.created_at
                            ? new Date(post.created_at).toLocaleDateString(
                                "en-BD",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "Recent"}
                        </span>
                      </div>
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <FaRegClock className="text-amber-400" />
                          <span>{post.readTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt ||
                        post.content?.slice(0, 120) ||
                        "No description available."}
                    </p>

                    {/* Read more link */}
                    <div className="mt-auto flex items-center text-amber-600 font-medium text-sm hover:text-amber-700 transition-colors group-hover/btn:translate-x-1">
                      <span>Read full article</span>
                      <svg
                        className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Decorative footer note */}
        {hasSavedPosts && (
          <div className="text-center mt-12 text-sm text-gray-400 border-t border-gray-200 pt-6">
            <p> Saved articles are private to your account.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedBlog;
