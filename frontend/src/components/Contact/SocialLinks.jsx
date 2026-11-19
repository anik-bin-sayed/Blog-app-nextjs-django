import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function SocialLinks() {
  return (
    <section className="bg-[#24221e] px-5 py-10 text-white sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Take a look around</p>
          <p className="mt-2 font-serif text-xl text-stone-100">There’s always another story waiting.</p>
        </div>
        <Link href="/blogs" className="group inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-amber-200 hover:bg-amber-200 hover:text-stone-900 sm:self-auto">Browse the journal <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" /></Link>
      </div>
    </section>
  );
}
