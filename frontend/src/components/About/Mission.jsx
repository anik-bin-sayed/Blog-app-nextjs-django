import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Mission() {
  return (
    <section className="bg-[#f5f1e9] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-stone-200/80 bg-[#fffdf9] shadow-[0_25px_65px_-42px_rgba(41,32,22,0.35)] lg:grid-cols-2">
        <div className="relative min-h-[270px] bg-stone-200 sm:min-h-[360px] lg:min-h-[500px]">
          <Image
            src="https://images.pexels.com/photos/3201268/pexels-photo-3201268.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="A quiet moment outdoors in the afternoon light"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/25 to-transparent" />
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14 xl:p-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Why this journal exists</p>
          <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-stone-900 sm:text-4xl">A place to inspire, learn, and <span className="italic text-amber-800">connect.</span></h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
            <p>At the heart of this journal is a simple mission: to share useful insights and honest experiences that stay with you. I write about travel, technology, wellness, and the ideas that help us grow.</p>
            <p>Come along as we explore new places, welcome change, and make a little more room for a balanced, fulfilling life.</p>
          </div>
          <Link href="/blogs" className="group mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-900">
            Read the stories <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
