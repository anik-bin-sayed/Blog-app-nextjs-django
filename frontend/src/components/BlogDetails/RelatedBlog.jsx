import Link from "next/link";
import Card from "../cards/card";
import { FaArrowRight } from "react-icons/fa";

export default function RelatedBlog({ relatedBlog, isLoading, isError }) {
  return (
    <section className="bg-[#fffdf9] px-5 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Keep exploring</p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">More stories for <span className="italic text-amber-800">you</span></h2>
          </div>
          <Link href="/blogs" className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-stone-700 transition hover:text-amber-900 sm:self-auto">All stories <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" /></Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="overflow-hidden rounded-2xl border border-stone-200 bg-white"><div className="aspect-[1.45/1] animate-pulse bg-stone-200" /><div className="space-y-3 p-5"><div className="h-3 w-1/3 animate-pulse rounded bg-stone-200" /><div className="h-5 w-4/5 animate-pulse rounded bg-stone-200" /><div className="h-3 w-full animate-pulse rounded bg-stone-100" /></div></div>)}</div>
        ) : isError ? (
          <p className="rounded-2xl border border-stone-200 bg-[#faf7f0] px-6 py-10 text-center text-sm text-stone-600">Related stories are unavailable right now.</p>
        ) : relatedBlog?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{relatedBlog.slice(0, 3).map((post) => <Card key={post.slug} post={post} />)}</div>
        ) : (
          <p className="rounded-2xl border border-dashed border-stone-300 bg-[#faf7f0] px-6 py-10 text-center text-sm text-stone-600">No related stories yet. There’s plenty more in the journal.</p>
        )}
      </div>
    </section>
  );
}
