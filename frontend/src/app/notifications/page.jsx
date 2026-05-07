import Notifications from "@/components/Notifications";
import React, { Suspense } from "react";

const page = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Notifications />
      </Suspense>
    </>
  );
};

export default page;
