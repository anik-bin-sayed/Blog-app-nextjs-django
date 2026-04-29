import React from "react";

const ComponentLoader = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500">Loading activity data...</p>
      </div>
    </div>
  );
};

export default ComponentLoader;
