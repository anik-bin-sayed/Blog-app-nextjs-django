import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaRegCompass } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-[#faf7f0]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.94fr_1.06fr] lg:gap-16 lg:px-10 lg:py-20">
        <div className="relative z-10 max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-900/10 bg-white/70 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">
            <FaRegCompass className="text-amber-700" /> A journal for the curious
          </div>
          <h1 className="font-serif text-[3.25rem] font-medium leading-[1.04] tracking-[-0.045em] text-stone-900 sm:text-6xl lg:text-[4.55rem]">
            Stories that make you <span className="italic text-amber-800">see things differently.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
            A thoughtful collection of ideas, experiences, and places. Take a breath, find a story, and follow where it leads.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/blogs" className="group inline-flex items-center gap-3 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-stone-900/10 transition hover:-translate-y-0.5 hover:bg-amber-900">
              Explore the stories <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-sm text-stone-500">Good reads, at your own pace.</span>
          </div>
          <div className="mt-10 flex items-center gap-3 border-t border-stone-300/70 pt-5 text-xs font-medium uppercase tracking-[0.15em] text-stone-500">
            <span className="h-px w-9 bg-amber-700" /> Read. Reflect. Wander.
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="relative aspect-[1.13/1] overflow-hidden rounded-[2rem] bg-stone-200 shadow-[0_30px_80px_-35px_rgba(54,39,22,0.45)] sm:aspect-[1.25/1]">
            <Image
              src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1400&h=1100&fit=crop&auto=format"
              alt="A quiet mountain lake surrounded by forests"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover transition duration-700 hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-stone-950/5" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">A little inspiration</p>
              <p className="mt-2 max-w-md font-serif text-2xl leading-tight sm:text-3xl">Make room for a new perspective.</p>
            </div>
          </div>
          <div className="absolute -bottom-5 left-4 hidden rounded-2xl border border-white/70 bg-[#fffdf9]/95 px-5 py-4 shadow-xl backdrop-blur sm:block lg:-left-8">
            <span className="block font-serif text-2xl text-stone-900">Globira</span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.17em] text-stone-500">Stories & ideas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
