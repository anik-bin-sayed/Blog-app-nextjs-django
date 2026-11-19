"use client";

import Link from "next/link";
import Logo from "../ui/Logo";
import { useRecentBlogsQuery } from "@/redux/services/blogs/blogApi";
import { FaArrowRight, FaArrowUp } from "react-icons/fa";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "All stories", href: "/blogs" },
  { label: "About us", href: "/about" },
  { label: "Get in touch", href: "/contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: recentPosts } = useRecentBlogsQuery();
  const posts = Array.isArray(recentPosts) ? recentPosts.slice(0, 3) : [];

  return (
    <footer className="mt-auto border-t border-stone-800 bg-[#201e1a] text-stone-300">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pt-16 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.7fr_1fr] lg:gap-16">
          <div className="max-w-sm">
            <Logo position="footer" />
            <p className="mt-5 max-w-xs text-sm leading-7 text-stone-400">
              A quiet corner of the internet for thoughtful ideas, fresh perspectives, and stories worth sharing.
            </p>
            <Link href="/blogs" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 transition hover:text-amber-200">
              Find your next read <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-100">Explore</h2>
            <ul className="mt-5 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-stone-400 transition hover:text-amber-200">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-100">Latest stories</h2>
            {posts.length ? (
              <ul className="mt-5 divide-y divide-stone-800">
                {posts.map((post) => (
                  <li key={post.slug} className="py-3 first:pt-0 last:pb-0">
                    <Link href={`/blogs/${post.slug}`} className="group block">
                      <span className="line-clamp-2 text-sm font-medium leading-6 text-stone-300 transition group-hover:text-amber-200">{post.title}</span>
                      {post.date && <span className="mt-1 block text-xs text-stone-500">{post.date}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm leading-6 text-stone-500">New reads are on the way. Check back soon.</p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-stone-800 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Globira. Made for curious minds.</p>
          <Link href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="inline-flex items-center gap-2 self-start text-stone-400 transition hover:text-amber-200 sm:self-auto">
            Back to top <FaArrowUp className="text-[10px]" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
