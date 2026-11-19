"use client";

import React from "react";
import Card from "../cards/card";
import Link from "next/link";
import { useRecentBlogsQuery } from "@/redux/services/blogs/blogApi";
import { FaArrowRight } from "react-icons/fa";

export default function LatestBlog() {
  const { data: latestPosts, isLoading, isError } = useRecentBlogsQuery();
  const posts = Array.isArray(latestPosts) ? latestPosts.slice(0, 4) : [];

  return (
    <section className="bg-[#f5f1e9] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col justify-between gap-5 sm:mb-11 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Fresh off the page</p>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">The latest <span className="italic text-amber-800">reads</span></h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">New thoughts and discoveries from our little corner of the world.</p>
          </div>
          <Link href="/blogs" className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-stone-800 transition hover:text-amber-800 sm:self-auto">See every story <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" /></Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="overflow-hidden rounded-2xl border border-stone-200 bg-white"><div className="aspect-[1.35/1] animate-pulse bg-stone-200" /><div className="space-y-3 p-5"><div className="h-3 w-1/3 animate-pulse rounded bg-stone-200" /><div className="h-5 w-4/5 animate-pulse rounded bg-stone-200" /><div className="h-3 w-full animate-pulse rounded bg-stone-100" /></div></div>)}</div>
        ) : posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{posts.map((post) => <Card key={post.slug} post={post} />)}</div>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center">
            <p className="font-serif text-xl text-stone-800">{isError ? "We couldn’t load the latest stories just now." : "Your next favorite story is coming soon."}</p>
            <Link href="/blogs" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-950">Visit the story archive <FaArrowRight className="text-xs" /></Link>
          </div>
        )}
        <div className="mt-10 border-t border-stone-300/70 pt-5 text-center text-xs leading-5 text-stone-500">Take what you need. Come back when you’re ready.</div>
      </div>
    </section>
  );
}
