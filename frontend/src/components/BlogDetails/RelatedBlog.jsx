import React from "react";
import Card from "../cards/card";

const RelatedBlog = ({ relatedBlog, isLoading, isError }) => {
  if (isLoading) {
    return (
      <div className="my-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900  mb-8">
          Related Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700" />
              <div className="p-5">
                <div className="h-4 bg-gray-200  rounded w-1/3 mb-3" />
                <div className="h-6 bg-gray-200  rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200  rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-16 text-center py-8 px-4 bg-red-50 dark:bg-red-900/20 rounded-2xl">
        <p className="text-red-600 dark:text-red-400">
          Unable to load related articles. Please try again later.
        </p>
      </div>
    );
  }

  if (!relatedBlog || relatedBlog.length === 0) {
    return (
      <div className="mt-16 text-center py-8 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <p className="text-gray-500 dark:text-gray-400">
          No related articles found.
        </p>
      </div>
    );
  }

  return (
    <div className="my-16">
      <div className="flex items-center justify-center mb-8 ">
        <h2 className="text-2xl text-center md:text-3xl font-bold text-gray-900 ">
          Related Articles
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {relatedBlog.map((post, index) => {
          return <Card key={index} post={post} />;
        })}
      </div>
    </div>
  );
};

export default RelatedBlog;
