import React, { Suspense } from "react";

import AllBlogs from "@/components/Blogs/AllBlogs";
import BlogHero from "@/components/Blogs/BlogHero";
import GlobalLoader from "@/components/Loader/GlobalLoader";

const page = () => {
  return (
    <div className="bg-linear-to-br from-amber-50 via-white to-orange-50">
      <BlogHero />
      <Suspense fallback={<GlobalLoader />}>
        <AllBlogs />
      </Suspense>
    </div>
  );
};

export default page;
