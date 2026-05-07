"use client";

import { usePathname } from "next/navigation";
import Footer from "../shared/Footer";

export default function FooterController() {
  const pathname = usePathname();

  const hideFooter =
    pathname.startsWith("/dashboard") || pathname.startsWith("/notifications");

  if (hideFooter) return null;

  return <Footer />;
}
