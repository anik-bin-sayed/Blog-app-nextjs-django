"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import TextLink from "@/components/ui/textLink";

const ReadBlog = ({ blog, isLoading, isError }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadTime = (content) => {
    if (!content) return "1 min read";
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    return `${readTime} min read`;
  };

  const formatContent = (content) => {
    if (!content) return null;
    const paragraphs = content.split(/\r?\n\r?\n/);
    return paragraphs.map((paragraph, idx) => {
      if (!paragraph.trim()) return null;
      const lines = paragraph.split(/\r?\n/);
      return (
        <p key={idx} className="mb-6 leading-relaxed text-gray-900 ">
          {lines.map((line, lineIdx) => (
            <span key={lineIdx}>
              {line}
              {lineIdx < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading amazing content...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find the blog post you're looking for. It might have
            been moved or deleted.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 ">
      <article className="px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="inline-flex items-center gap-2 text-amber-600   transition-colors mb-8 text-sm md:text-base">
          <FaArrowLeft className="w-4 h-4" />
          <TextLink text="Back to all posts" link="/blogs" />
        </div>

        {blog.image && (
          <div className="relative w-full h-auto mb-10 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={blog.image}
              alt={blog.title || "Blog post cover"}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-4">
          <span className="text-amber-700 px-3 py-1 bg-amber-100 rounded-full text-sm font-medium">
            {blog.category || "Uncategorized"}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900  mb-6 leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-900  pb-8 mb-8 border-b border-gray-200 ">
          <div className="flex items-center gap-2">
            <FaUser className="w-4 h-4" />
            <span>By {blog.category || "Unknown Author"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="w-4 h-4" />
            <span>{formatDate(blog.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="w-4 h-4" />
            <span>{getReadTime(blog.content)}</span>
          </div>
        </div>

        {blog.excerpt && (
          <div className="mb-12 p-6 md:p-8  rounded-xl border-l-4 border-amber-500">
            <p className="text-md md:text-md text-gray-900  italic leading-relaxed">
              {blog.excerpt}
            </p>
          </div>
        )}

        <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none">
          {formatContent(blog.content)}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} • All rights reserved
            </div>
            <div className="flex gap-3">
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400">
                <FaFacebookF className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400">
                <FaTwitter className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400">
                <FaInstagram className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ReadBlog;
