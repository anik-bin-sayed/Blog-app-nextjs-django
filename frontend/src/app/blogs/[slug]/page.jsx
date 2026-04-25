"use client";

import { useBlogDetailsQuery } from "@/redux/services/blogs/blogApi";
import { useParams } from "next/navigation";

import ReadBlog from "@/components/BlogDetails/ReadBlog";
import RecentBlog from "@/components/BlogDetails/RelatedBlog";
import { IoMdLocate } from "react-icons/io";
import CommentForm from "@/components/BlogDetails/CommentForm";

const Page = () => {
  const params = useParams();
  const { slug } = params;

  const { data, isLoading, isError } = useBlogDetailsQuery(slug, {
    skip: !slug,
  });

  const blog = data?.blog;
  const relatedBlog = data?.relatedBlogs;

  return (
    <div className="min-h-screen  bg-linear-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto">
        <ReadBlog blog={blog} isLoading={isLoading} isError={isError} />
        <RecentBlog
          relatedBlog={relatedBlog}
          isLoading={isLoading}
          isError={isError}
        />
        <CommentForm />
      </div>
    </div>
  );
};

export default Page;
