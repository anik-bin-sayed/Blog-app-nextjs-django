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
    <main className="min-h-screen flex-1 bg-[#faf7f0]">
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
      {blog && !isPageLoading && (
        <section className="bg-[#faf7f0] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Community notes</p>
              <h2 className="mt-2 font-serif text-3xl font-medium text-stone-900 sm:text-4xl">Thoughts from readers</h2>
            </div>
            <CommentForm auth={auth} blog={blog} slug={slug} />
            <Suspense fallback={<div className="mt-6 h-24 animate-pulse rounded-2xl bg-stone-200" />}>
              <CommentList
                comments={comments}
                isLoading={isPageLoading}
                isError={isError}
                slug={slug}
              />
            </Suspense>
          </div>
        </section>
      )}
    </main>
  );
};

export default Page;
