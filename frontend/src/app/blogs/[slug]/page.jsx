"use client";

import { useBlogDetailsQuery } from "@/redux/services/blogs/blogApi";
import { useParams } from "next/navigation";

import ReadBlog from "@/components/BlogDetails/ReadBlog";
import RecentBlog from "@/components/BlogDetails/RelatedBlog";
import CommentForm from "@/components/BlogDetails/CommentForm";
import CommentList from "@/components/BlogDetails/CommentList";
import { useSelector } from "react-redux";
import { Suspense } from "react";

const Page = () => {
  const params = useParams();
  const { slug } = params;

  const { auth } = useSelector((state) => state.auth);

  const { data, isLoading, isError, isFetching } = useBlogDetailsQuery(slug, {
    skip: !slug,
  });

  const isPageLoading = !slug || isLoading || isFetching;

  const blog = data?.blog;
  const relatedBlog = data?.relatedBlogs;
  const comments = data?.comments;

  return (
    <div className="min-h-screen  bg-linear-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto">
        <ReadBlog
          auth={auth}
          blog={blog}
          isLoading={isPageLoading}
          isError={isError}
        />
        <RecentBlog
          relatedBlog={relatedBlog}
          isLoading={isPageLoading}
          isError={isError}
        />
      
        <CommentForm auth={auth} blog={blog} slug={slug} />

        <Suspense fallback={<div>Loading...</div>}>
          <CommentList
            comments={comments}
            isLoading={isPageLoading}
            isError={isError}
            slug={slug}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
