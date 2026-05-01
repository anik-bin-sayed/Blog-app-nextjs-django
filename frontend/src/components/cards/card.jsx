import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

const Card = ({ post }) => {
  return (
    <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer border border-gray-100">
      <Link href={`/blogs/${post.slug}`}>
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <Image
            src={post.image || ""}
            alt={post.title}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            priority
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            {post.category}
          </div>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2 tracking-wide">
          <span className="font-medium">
            {" "}
            {new Date(post.created_at).toLocaleDateString("en-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        <Link href={`/blogs/${post.slug}`}>
          <h3 className="text-md font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors leading-tight">
            {post.title.slice(0, 28) + (post.title.length > 28 ? "..." : "")}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
          {post.excerpt}
        </p>

        <Link
          href={`/blogs/${post.slug || ""}`}
          className="self-start flex items-center text-amber-600 font-medium text-sm hover:text-amber-700 transition-colors group/btn cursor-pointer"
        >
          <span>Read more</span>
          <FaArrowRight className="h-4 w-4 ml-2 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};

export default Card;
