import React, { Suspense } from "react";

import AllBlogs from "@/components/Blogs/AllBlogs";
import BlogHero from "@/components/Blogs/BlogHero";
import GlobalLoader from "@/components/Loader/GlobalLoader";

export const metadata = {
  title: "Stories & Journal | Globira",
  description:
    "Browse Globira's collection of stories, field notes, ideas, and discoveries.",
};

export default function BlogsPage() {
  return (
    <main className="flex-1 bg-[#faf7f0]">
      <BlogHero />
      <Suspense fallback={<GlobalLoader />}>
        <AllBlogs />
      </Suspense>
    </main>
  );
}
