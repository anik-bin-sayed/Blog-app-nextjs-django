"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaAirbnb,
} from "react-icons/fa";
import ChatBot from "./AI/ChatBot";

const ReadBlog = ({ auth, blog, isLoading, isError }) => {
  const [selectedText, setSelectedText] = useState("");
  const [showAskButton, setShowAskButton] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (showAskButton) {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setShowAskButton(false);
      }, 100);
    }
  }, [showAskButton]);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const selectedTextStr = selection?.toString().trim();

      if (selectedTextStr && selectedTextStr.length > 5) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        let left = rect.left + rect.width / 2 - 60;
        const top = rect.bottom + 15;

        left = Math.max(10, Math.min(left, window.innerWidth - 130));

        setSelectedText(selectedTextStr);
        setPosition({ x: left, y: top });
        setShowAskButton(true);
      } else {
        setShowAskButton(false);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  const handleAskAI = () => {
    setShowAskButton(false);
    setIsChatOpen(true);
  };

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
        <p key={`p-${idx}`} className="mb-6 leading-relaxed text-gray-900">
          {lines.map((line, lineIdx) => (
            <span key={`line-${idx}-${lineIdx}`}>
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the blog post you're looking for.
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
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 relative">
      <article className="px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="inline-flex items-center gap-2 text-amber-600 transition-colors mb-8 text-sm md:text-base">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors hover:underline cursor-pointer"
            aria-label="Go back to blogs select-none"
          >
            <FaArrowLeft className="w-4 h-4 select-none" /> Back to Blogs
          </button>
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
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-4">
          <span className="text-amber-700 px-3 py-1 bg-amber-100 rounded-full text-sm font-medium select-none">
            {blog.category || "Uncategorized"}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight selection:bg-gray-400/50 selection:text-black">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-900 pb-8 mb-8 border-b border-gray-200 select-none">
          <div className="flex items-center gap-2">
            <FaUser className="w-4 h-4" />
            <span>By {blog.author || "Unknown Author"}</span>
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
          <div className="mb-12 p-6 md:p-8 rounded-xl border-l-4 border-amber-500 bg-white/50">
            <p className="text-md md:text-md text-gray-900 italic leading-relaxed selection:bg-gray-400/50 selection:text-black">
              {blog.excerpt}
            </p>
          </div>
        )}

        <div className="prose prose-lg prose-indigo max-w-none selection:bg-gray-400/50 selection:text-black">
          {auth ? (
            formatContent(blog.content)
          ) : (
            <p className="text-center text-red-500 font-medium select-none">
              Please login to read the full blog post.
            </p>
          )}
        </div>

        {showAskButton && !isChatOpen && auth && (
          <button
            onClick={handleAskAI}
            className="fixed bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 cursor-pointer z-50 transition-all duration-200"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
            aria-label="Ask AI about selected text"
          >
            <FaAirbnb />
            Ask AI To Explanation
          </button>
        )}

        {showAskButton && !auth && (
          <p
            className="fixed bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 cursor-pointer z-50 transition-all duration-200"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
            aria-label="Ask AI about selected text"
          >
            Please login to ask AI about selected text.
          </p>
        )}

        {isChatOpen && (
          <ChatBot
            selectedText={selectedText}
            setSelectedText={setSelectedText}
            setIsChatOpen={setIsChatOpen}
          />
        )}
      </article>
    </div>
  );
};

export default ReadBlog;
