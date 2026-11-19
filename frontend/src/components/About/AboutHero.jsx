import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function AboutHero() {
  return (
    <section className="relative isolate min-h-[470px] overflow-hidden bg-stone-900 sm:min-h-[540px]">
      <Image
        src="https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg?auto=compress&cs=tinysrgb&w=1800"
        alt="A winding mountain road disappearing into the clouds"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/85 via-stone-950/55 to-stone-950/15" />
      <div className="mx-auto flex min-h-[470px] max-w-7xl items-center px-5 py-16 sm:min-h-[540px] sm:px-8 lg:px-10">
        <div className="max-w-2xl text-white">
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200"><span className="h-px w-8 bg-amber-300" /> A little about Globira</p>
          <h1 className="font-serif text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Curiosity brought me here. <span className="italic text-amber-200">Stories keep me going.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">I’m Sophia Ellis—marketer, traveler, and lifelong collector of stories. This is where I share what the world keeps teaching me.</p>
          <Link href="#my-story" className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-amber-200">Get to know me <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" /></Link>
        </div>
      </div>
    </section>
  );
}
