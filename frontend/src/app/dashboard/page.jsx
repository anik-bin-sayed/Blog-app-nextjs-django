import Dashboard from "@/components/Dashboard";
import GlobalLoader from "@/components/Loader/GlobalLoader";
import React, { Suspense } from "react";

const page = () => {
  return (
    <>
      <Suspense fallback={<GlobalLoader />}>
        <Dashboard />
      </Suspense>
    </>
  );
};

export default page;
