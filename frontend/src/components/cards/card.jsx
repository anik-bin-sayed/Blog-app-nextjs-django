import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowRight, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useSelector } from "react-redux";

const Card = ({ post, onSave, savedButton = false, isSaved, role }) => {
  const { auth } = useSelector((state) => state.auth);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) onSave(post.id);
  };

  const isButtonShown = savedButton && auth && role === "user";

  return (
    <article className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-[#fffdf9] shadow-[0_10px_30px_-24px_rgba(41,32,22,0.45)] transition duration-300 hover:-translate-y-1 hover:border-amber-900/20 hover:shadow-[0_24px_45px_-28px_rgba(41,32,22,0.4)]">
      <Link href={`/blogs/${post.slug}`}>
        <div className="relative aspect-[1.45/1] overflow-hidden bg-stone-200">
          <Image
            src={post.image || ""}
            alt={post.title}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            priority
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {/* Category badge */}
          <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-[#fffdf9]/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-900 shadow-sm backdrop-blur-sm select-none">
            {post.category}
          </div>

          {/* saved button */}
          {isButtonShown && (
            <button
              onClick={handleSaveClick}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all duration-200 focus:outline-none"
              aria-label={isSaved ? "Unsave blog" : "Save blog"}
            >
              {isSaved ? (
                <FaBookmark className="text-amber-600 w-4 h-4" />
              ) : (
                <FaRegBookmark className="text-gray-700 w-4 h-4 hover:text-amber-500 transition" />
              )}
            </button>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium tracking-wide text-stone-500 select-none">
          <span>
            {post.created_at ? new Date(post.created_at).toLocaleDateString("en-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }) : "Recently published"}
          </span>
          <span>•</span>
          <span>{post.readTime || "5 min read"}</span>
        </div>
        <Link href={`/blogs/${post.slug}`}>
          <h3 className="mb-2 line-clamp-2 font-serif text-xl font-semibold leading-snug text-stone-900 transition-colors group-hover:text-amber-900 select-none">
            {post.title}
          </h3>
        </Link>

        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-6 text-stone-600 select-none">
          {post.excerpt}
        </p>

        <Link
          href={`/blogs/${post.slug || ""}`}
          className="group/btn inline-flex items-center self-start text-sm font-semibold text-amber-900 transition-colors hover:text-amber-700 select-none"
        >
          <span>Read more</span>
          <FaArrowRight className="ml-2 h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-1 select-none" />
        </Link>
      </div>
    </article>
  );
};

export default Card;
