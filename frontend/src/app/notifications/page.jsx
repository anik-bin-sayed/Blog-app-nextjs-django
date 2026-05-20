import Notifications, {
  NotificationsLoader,
} from "@/components/Notifications";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<NotificationsLoader />}>
      <Notifications />
    </Suspense>
  );
};

export default page;