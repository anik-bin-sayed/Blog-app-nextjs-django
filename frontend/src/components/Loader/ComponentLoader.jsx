import React from "react";

const ComponentLoader = () => {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex animate-pulse flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-800/20 border-t-amber-800"></div>
        <p className="text-sm text-stone-500">Loading your workspace…</p>
      </div>
    </div>
  );
};

export default ComponentLoader;
