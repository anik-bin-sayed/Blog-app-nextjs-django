import React from "react";

const CardLoader = ({ title = "title", description = "description" }) => {
  return (
    <div className="my-16 max-w-6xl mx-auto">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
          {title}{" "}
          <span className="text-amber-600 relative inline-block">
            Stories
            <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-200 rounded-full -mb-2"></span>
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
          {description}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white  rounded-2xl shadow-sm overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200 " />
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
};

export default CardLoader;
