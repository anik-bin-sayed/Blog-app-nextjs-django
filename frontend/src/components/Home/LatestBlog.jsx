"use client";

import React from "react";
import Card from "../cards/card";
import LinkButton from "../ui/LinkButton";
import { useRecentBlogsQuery } from "@/redux/services/blogs/blogApi";
import CardLoader from "../utils/CardLoader";

const LatestBlog = () => {
  const { data: latestPosts, isLoading } = useRecentBlogsQuery();

  if (isLoading) {
    return (
      <CardLoader
        title="Recent"
        description=" Fresh insights, travel tips, and inspiring tales from our journeys"
      />
    );
  }

  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-amber-50/30 via-white to-orange-50/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">
            Recent{" "}
            <span className="text-amber-600 relative inline-block">
              Stories
              <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-200 rounded-full -mb-2"></span>
            </span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Fresh insights, travel tips, and inspiring tales from our journeys
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 w-full">
          {latestPosts &&
            latestPosts.map((post, index) => <Card key={index} post={post} />)}
        </div>

        <div className="text-center mt-12">
          <LinkButton text="View All Blogs" link="/blogs" />
        </div>
      </div>
    </section>
  );
};

export default LatestBlog;
