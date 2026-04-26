"use client";

import React from "react";
import LinkButton from "../ui/LinkButton";
import Card from "../cards/card";
import { useFeaturedBlogsQuery } from "@/redux/services/blogs/blogApi";
import CardLoader from "../utils/CardLoader";

const FeatureBlog = () => {
  const { data: featuredPosts, isLoading, isError } = useFeaturedBlogsQuery();

  if (isLoading) {
    return (
      <CardLoader
        title="Feature"
        description="Inspiring tales, expert tips, and hidden gems from our travels"
      />
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-linear-to-br from-white via-amber-50/30 to-orange-50/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
            Feature{" "}
            <span className="text-amber-600 relative inline-block">
              Stories
              <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-200 rounded-full -mb-2"></span>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
            Inspiring tales, expert tips, and hidden gems from our travels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-10">
          {featuredPosts &&
            featuredPosts.map((post, index) => (
              <Card key={index} post={post} />
            ))}
        </div>

        <div className="text-center mt-12">
          <LinkButton text="View All Blogs" link="/blogs" />
        </div>
      </div>
    </section>
  );
};

export default FeatureBlog;
