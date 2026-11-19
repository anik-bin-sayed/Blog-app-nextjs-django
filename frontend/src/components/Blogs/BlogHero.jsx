import Image from "next/image";
import Link from "next/link";
import { FaArrowDown } from "react-icons/fa";

export default function BlogHero() {
  return (
    <section className="relative isolate min-h-[370px] overflow-hidden bg-stone-900 sm:min-h-[420px]">
      <Image
        src="https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1800"
        alt="A winding path through a dramatic mountain landscape"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/85 via-stone-950/55 to-stone-950/15" />
      <div className="mx-auto flex min-h-[370px] max-w-7xl items-center px-5 py-16 sm:min-h-[420px] sm:px-8 lg:px-10">
        <div className="max-w-2xl text-white">
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200"><span className="h-px w-8 bg-amber-300" /> The Globira journal</p>
          <h1 className="font-serif text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">A story for wherever <span className="italic text-amber-200">you are.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">Field notes, fresh ideas, and small discoveries for a life lived with curiosity.</p>
          <Link href="#all-stories" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-amber-200">Find your next read <FaArrowDown className="text-xs" /></Link>
        </div>
      </div>
    </section>
  );
}
