import Link from "next/link";
import React from "react";
import Logo from "../ui/Logo";
import { useRecentBlogsQuery } from "@/redux/services/blogs/blogApi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const { data: recentPosts } = useRecentBlogsQuery();

  const socialLinks = [
    {
      name: "Facebook",
      icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
      href: "#",
    },
    {
      name: "Twitter",
      icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
      href: "#",
    },
    {
      name: "Instagram",
      icon: "M16 3H8a5 5 0 00-5 5v8a5 5 0 005 5h8a5 5 0 005-5V8a5 5 0 00-5-5zm-4 10a3 3 0 110-6 3 3 0 010 6zm6.5-6a1 1 0 110-2 1 1 0 010 2z",
      href: "#",
    },
    {
      name: "Pinterest",
      icon: "M8 20v-6.5M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 4a4 4 0 100 8 4 4 0 000-8z",
      href: "#",
    },
  ];

  return (
    <footer className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-gray-400 leading-relaxed">
              Exploring the world one story at a time. We share authentic travel
              experiences, practical tips, and hidden gems to inspire your next
              journey.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-lg mb-4 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-500 rounded-full -mb-1"></span>
            </h4>
            <ul className="space-y-2">
              {["Home", "About", "Blogs", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-amber-400 transition-colors duration-200 text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-lg mb-4 relative inline-block">
              Recent Posts
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-500 rounded-full -mb-1"></span>
            </h4>
            <ul className="space-y-3">
              {recentPosts &&
                recentPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blogs/${post.slug}`} className="group block">
                      <p className="text-sm font-medium text-gray-300 group-hover:text-amber-400 transition-colors">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {post.date}
                      </p>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4 relative inline-block">
              Stay Updated
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-500 rounded-full -mb-1"></span>
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest posts and travel inspiration straight to your
              inbox.
            </p>
            <form className="sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-white placeholder-gray-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 mt-4 bg-yellow-600 hover:bg-yellow-700 text-black font-medium rounded transition-colors duration-200 text-sm shadow-md cursor-pointer "
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>&copy; {currentYear} WanderLog. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="hover:text-amber-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-amber-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="hover:text-amber-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
