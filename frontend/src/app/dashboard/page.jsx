import Dashboard from "@/components/Dashboard";
import GlobalLoader from "@/components/Loader/GlobalLoader";
import { Suspense } from "react";

export const metadata = {
  title: "Admin Dashboard | Globira",
  description: "Manage stories, readers, and activity for the Globira journal.",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <Dashboard />
    </Suspense>
  );
}
