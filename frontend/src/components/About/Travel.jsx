import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Travel() {
  return (
    <section className="bg-[#fffdf9] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Always taking the long way</p>
          <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">Wanderlust, and <span className="italic text-amber-800">why I travel.</span></h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
            <p>Travel is more than a hobby. It shifts my perspective and makes the familiar feel new again. Every journey offers a chance to step outside my routine and learn from a different landscape or way of life.</p>
            <p>I travel to see the world through other eyes, listen to the stories and traditions of others, and appreciate the remarkable variety of our planet.</p>
          </div>
          <Link href="/blogs" className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-amber-900 transition hover:text-amber-700">Follow along in the journal <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" /></Link>
        </div>
        <div className="order-1 lg:order-2">
          <div className="relative aspect-[1.2/1] overflow-hidden rounded-[2rem] bg-stone-200 shadow-[0_25px_65px_-35px_rgba(41,32,22,0.4)]">
            <Image
              src="https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="A mountain trail opening to a wide, peaceful landscape"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition duration-700 hover:scale-[1.03]"
            />
            <div className="absolute bottom-5 left-5 rounded-xl border border-white/60 bg-[#fffdf9]/90 px-4 py-3 backdrop-blur sm:bottom-7 sm:left-7">
              <p className="font-serif text-lg text-stone-900">Keep looking closer.</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-stone-500">The world has more to show</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
