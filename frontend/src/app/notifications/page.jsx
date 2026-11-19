import Notifications, {
  NotificationsLoader,
} from "@/components/Notifications";
import { Suspense } from "react";

export const metadata = {
  title: "Notifications | Globira",
  description: "Keep up with comments and activity from your stories.",
};

export default function NotificationsPage() {
  return (
    <Suspense fallback={<NotificationsLoader />}>
      <Notifications />
    </Suspense>
  );
}
