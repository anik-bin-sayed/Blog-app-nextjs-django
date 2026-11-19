"use client";

import { useSavedBlogsListQuery, useSavedBlogsMutation } from "@/redux/services/blogs/blogApi";
import Image from "next/image";
import Link from "next/link";
import { FaBookmark, FaRegBookmark, FaRegCalendarAlt, FaArrowRight } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineDescription } from "react-icons/md";
import { useSelector } from "react-redux";

function SavedStoriesSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="aspect-[1.45/1] animate-pulse bg-stone-200" />
          <div className="space-y-3 p-5"><div className="h-3 w-1/3 animate-pulse rounded bg-stone-200" /><div className="h-5 w-4/5 animate-pulse rounded bg-stone-200" /><div className="h-3 w-full animate-pulse rounded bg-stone-100" /><div className="h-3 w-2/3 animate-pulse rounded bg-stone-100" /></div>
        </div>
      ))}
    </div>
  );
}

export default function SavedBlog() {
  const { auth } = useSelector((state) => state.auth);
  const { data: savedPosts, isLoading, isError, refetch } = useSavedBlogsListQuery(auth, { skip: !auth });
  const [toggleSaved, { isLoading: isUpdating }] = useSavedBlogsMutation();
  const posts = Array.isArray(savedPosts) ? savedPosts : [];

  const handleUnsave = async (postId) => {
    try {
      await toggleSaved(postId).unwrap();
    } catch (error) {
      console.error("Could not remove saved story:", error);
    }
  };

  return (
    <main className="min-h-[70vh] flex-1 bg-[#faf7f0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col justify-between gap-5 border-b border-stone-200 pb-8 sm:mb-11 sm:flex-row sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800"><FaBookmark className="text-[11px]" /> Your personal collection</p>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-stone-900 sm:text-5xl">Saved <span className="italic text-amber-800">for later.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">A thoughtful little reading list, ready whenever you are.</p>
          </div>
          {!isLoading && !isError && posts.length > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-500"><strong className="text-stone-900">{posts.length}</strong> of 8 saved</span>
              <Link href="/blogs" className="group inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-900">Find more stories <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" /></Link>
            </div>
          )}
        </div>

        {isLoading ? <SavedStoriesSkeleton /> : isError ? (
          <div className="rounded-[2rem] border border-stone-200 bg-white px-6 py-14 text-center shadow-sm">
            <IoWarningOutline className="mx-auto text-4xl text-amber-800" />
            <h2 className="mt-4 font-serif text-2xl text-stone-900">Your reading list didn’t load.</h2>
            <p className="mt-2 text-sm text-stone-500">Please try again in a moment.</p>
            <button type="button" onClick={() => refetch()} className="mt-5 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-900">Try again</button>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white/70 px-6 py-16 text-center sm:py-20">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-900"><FaRegBookmark className="text-2xl" /></span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Room for a good read</p>
            <h2 className="mt-2 font-serif text-3xl text-stone-900">Your collection is waiting.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-600">When a story catches your eye, save it here and come back whenever you’re ready.</p>
            <Link href="/blogs" className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-900">Explore the journal <FaArrowRight className="text-xs" /></Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((post) => (
                <article key={post.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-[#fffdf9] shadow-[0_10px_30px_-24px_rgba(41,32,22,0.45)] transition duration-300 hover:-translate-y-1 hover:border-amber-900/20 hover:shadow-[0_24px_45px_-28px_rgba(41,32,22,0.4)]">
                  <button type="button" onClick={() => handleUnsave(post.id)} disabled={isUpdating} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-[#fffdf9]/95 text-amber-900 shadow-sm backdrop-blur transition hover:bg-rose-50 hover:text-rose-700 disabled:cursor-wait disabled:opacity-60" aria-label={`Remove ${post.title} from saved stories`} title="Remove from saved">
                    <FaBookmark className="text-sm" />
                  </button>

                  <Link href={`/blogs/${post.slug}`} className="flex flex-1 flex-col">
                    <div className="relative aspect-[1.45/1] overflow-hidden bg-stone-200">
                      {post.image ? <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" /> : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-stone-200"><MdOutlineDescription className="text-5xl text-amber-800/40" /></div>}
                      {post.category && <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-[#fffdf9]/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-950 shadow-sm backdrop-blur-sm">{post.category}</span>}
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-medium tracking-wide text-stone-500"><FaRegCalendarAlt className="text-amber-800" />{post.created_at ? new Date(post.created_at).toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" }) : "Recently published"}</span>
                      <h2 className="mb-2 line-clamp-2 font-serif text-xl font-semibold leading-snug text-stone-900 transition-colors group-hover:text-amber-900">{post.title}</h2>
                      <p className="mb-5 line-clamp-3 flex-1 text-sm leading-6 text-stone-600">{post.excerpt || post.content?.slice(0, 140) || "A story from the Globira journal."}</p>
                      <span className="inline-flex items-center self-start text-sm font-semibold text-amber-900">Continue reading <FaArrowRight className="ml-2 text-xs transition-transform group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            <p className="mt-10 border-t border-stone-200 pt-5 text-center text-xs text-stone-500">Your saved stories are private to your account.</p>
          </>
        )}
      </div>
    </main>
  );
}
