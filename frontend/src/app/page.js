import FeatureBlog from "@/components/Home/FeatureBlog";
import Hero from "@/components/Home/Hero";
import LatestBlog from "@/components/Home/LatestBlog";
import Passions from "@/components/Home/Passions";
import React from "react";

const page = () => {
  return (
    <div className="bg-linear-to-br from-amber-50 via-white to-orange-50">
      <Hero />
      <FeatureBlog />
      <Passions />
      <LatestBlog />
    </div>
  );
};

export default page;
