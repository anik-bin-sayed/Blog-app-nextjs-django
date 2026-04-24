import React from "react";

import AllBlogs from "@/components/Blogs/AllBlogs";
import BlogHero from "@/components/Blogs/BlogHero";

const page = () => {
  return (
    <div className="bg-linear-to-br from-amber-50 via-white to-orange-50">
      <BlogHero />
      <AllBlogs />
    </div>
  );
};

export default page;
