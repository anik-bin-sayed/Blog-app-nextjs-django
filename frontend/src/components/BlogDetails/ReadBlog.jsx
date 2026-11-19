"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { FaArrowLeft, FaUser, FaCalendarAlt, FaClock, FaAirbnb } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import ChatBot from "./AI/ChatBot";
import Voice from "./voice";

export default function ReadBlog({ auth, blog, isLoading, isError }) {
  const [selectedText, setSelectedText] = useState("");
  const [showAskButton, setShowAskButton] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [voice, setVoice] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (!showAskButton) return;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setShowAskButton(false), 100);
  }, [showAskButton]);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const selectedTextStr = selection?.toString().trim();
      if (selectedTextStr && selectedTextStr.length > 5) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const left = Math.max(10, Math.min(rect.left + rect.width / 2 - 70, window.innerWidth - 150));
        setSelectedText(selectedTextStr);
        setPosition({ x: left, y: Math.min(rect.bottom + 12, window.innerHeight - 60) });
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const getReadTime = (content) => {
    if (!content) return "1 min read";
    return `${Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} min read`;
  };

  const formatContent = (content) => {
    if (!content) return null;
    return content.split(/\r?\n\r?\n/).map((paragraph, index) => {
      if (!paragraph.trim()) return null;
      const lines = paragraph.split(/\r?\n/);
      return (
        <p key={`p-${index}`} className="mb-7 text-[17px] leading-[1.9] text-stone-700 sm:text-[18px]">
          {lines.map((line, lineIndex) => <span key={`line-${index}-${lineIndex}`}>{line}{lineIndex < lines.length - 1 && <br />}</span>)}
        </p>
      );
    });
  };

  if (isLoading) {
    return (
      <section className="bg-[#faf7f0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-4 w-28 rounded bg-stone-200" />
          <div className="mx-auto mt-10 max-w-3xl space-y-4"><div className="mx-auto h-4 w-32 rounded bg-stone-200" /><div className="h-12 rounded bg-stone-200" /><div className="mx-auto h-5 w-2/3 rounded bg-stone-100" /></div>
          <div className="mt-10 aspect-[1.9/1] rounded-[2rem] bg-stone-200" />
          <div className="mx-auto mt-12 max-w-3xl space-y-4"><div className="h-5 rounded bg-stone-200" /><div className="h-5 rounded bg-stone-200" /><div className="h-5 w-4/5 rounded bg-stone-100" /></div>
        </div>
      </section>
    );
  }

  if (isError || !blog) {
    return (
      <section className="bg-[#faf7f0] px-5 py-24 text-center sm:px-8">
        <div className="mx-auto max-w-lg rounded-[2rem] border border-stone-200 bg-white px-7 py-14 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Lost in the pages?</p>
          <h1 className="mt-3 font-serif text-3xl text-stone-900">We couldn’t find that story.</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">It may have moved, or the address might be incorrect. Browse the journal to find another read.</p>
          <Link href="/blogs" className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-900"><FaArrowLeft className="text-xs" /> Back to stories</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#faf7f0] px-5 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-10">
      <article className="mx-auto max-w-5xl">
        <Link href="/blogs" className="group inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-xs font-semibold text-stone-600 transition hover:border-amber-800/30 hover:text-amber-900"><FaArrowLeft className="text-[10px] transition-transform group-hover:-translate-x-0.5" /> All stories</Link>

        <header className="mx-auto max-w-4xl py-9 text-center sm:py-12">
          <span className="inline-flex rounded-full border border-amber-900/10 bg-amber-100/70 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-950">{blog.category || "Journal"}</span>
          <h1 className="mt-5 font-serif text-3xl font-medium leading-[1.12] tracking-tight text-stone-950 selection:bg-amber-200 sm:text-4xl lg:text-6xl">{blog.title}</h1>
          {blog.excerpt && <p className="mx-auto mt-5 max-w-2xl font-serif text-base italic leading-7 text-stone-600 sm:text-lg sm:leading-8">{blog.excerpt}</p>}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-stone-500 sm:text-sm">
            <span className="inline-flex items-center gap-2"><FaUser className="text-amber-800" /> {blog.author || "Globira Journal"}</span>
            {blog.created_at && <span className="inline-flex items-center gap-2"><FaCalendarAlt className="text-amber-800" /> {formatDate(blog.created_at)}</span>}
            <span className="inline-flex items-center gap-2"><FaClock className="text-amber-800" /> {getReadTime(blog.content)}</span>
          </div>
        </header>

        {blog.image && (
          <figure className="relative isolate aspect-[1.75/1] overflow-hidden rounded-[1.5rem] bg-stone-200 shadow-[0_28px_70px_-38px_rgba(41,32,22,0.42)] sm:rounded-[2rem]">
            <Image src={blog.image} alt={blog.title || "Story cover"} fill priority sizes="(max-width: 768px) 100vw, 1200px" className="object-cover" />
          </figure>
        )}

        <div className="mx-auto mt-10 max-w-[740px] sm:mt-14">
          <div id="article-content" className="selection:bg-amber-200 selection:text-stone-950">
            {auth ? (
              <div className="font-serif">{formatContent(blog.content)}</div>
            ) : (
              <div className="rounded-2xl border border-amber-900/10 bg-white p-7 text-center sm:p-10">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-900"><FiLock /></span>
                <h2 className="mt-4 font-serif text-2xl text-stone-900">This story is for members</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">Log in to continue reading and join the conversation.</p>
                <Link href="/login" className="mt-5 inline-flex rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-900">Log in to read</Link>
              </div>
            )}
          </div>
          {auth && <div className="mt-10 border-t border-stone-200 pt-5"><Voice setVoice={setVoice} blog={blog} voice={voice} /></div>}
        </div>

        {showAskButton && !isChatOpen && (
          auth ? (
            <button type="button" onClick={() => { setShowAskButton(false); setIsChatOpen(true); }} className="fixed z-50 inline-flex items-center gap-2 rounded-full border border-white/20 bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl transition hover:bg-amber-900" style={{ left: `${position.x}px`, top: `${position.y}px` }} aria-label="Ask AI about selected text"><FaAirbnb /> Ask AI about this</button>
          ) : (
            <Link href="/login" className="fixed z-50 rounded-full bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl" style={{ left: `${position.x}px`, top: `${position.y}px` }}>Log in to ask AI</Link>
          )
        )}
        {isChatOpen && <ChatBot selectedText={selectedText} setSelectedText={setSelectedText} setIsChatOpen={setIsChatOpen} />}
      </article>
    </section>
  );
}
