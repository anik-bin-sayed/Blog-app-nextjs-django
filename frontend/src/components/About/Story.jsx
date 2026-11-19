import Image from "next/image";

export default function Story() {
  return (
    <section id="my-story" className="scroll-mt-24 bg-[#fffdf9] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
        <div className="relative mx-auto w-full max-w-lg lg:mx-0">
          <div className="absolute -bottom-4 -left-4 h-2/3 w-2/3 rounded-[2rem] bg-amber-100 sm:-bottom-6 sm:-left-6" />
          <div className="relative aspect-[0.88/1] overflow-hidden rounded-[2rem] bg-stone-200 shadow-[0_25px_65px_-35px_rgba(41,32,22,0.45)]">
            <Image
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1000"
              alt="Sophia Ellis outdoors, reflecting on the places that inspire her"
              fill
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 text-white sm:bottom-7 sm:left-7">
              <p className="font-serif text-2xl">Sophia Ellis</p>
              <p className="mt-1 text-xs tracking-wide text-white/80">Storyteller & curious traveler</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">The short version</p>
          <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">A career in stories, a life in <span className="italic text-amber-800">motion.</span></h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
            <p>Fueled by a lifelong fascination with storytelling, my marketing career began in a dynamic agency where I learned the art of digital strategy and branding. Over the past decade, I’ve shaped narratives that connect and inspire across industries.</p>
            <p>Beyond the office, exploration has taken me to 15 countries, each one widening my perspective. I’m equally drawn to technology, new ideas, and the small discoveries that change how we see everyday life.</p>
            <p>This journal brings those threads together: travel tales, thoughtful insights, and personal growth. It’s a record of lessons learned, questions I’m still asking, and places I hope to see next.</p>
          </div>
          <div className="mt-8 border-l-2 border-amber-700 pl-4 font-serif text-lg italic leading-relaxed text-stone-800">“The best stories begin with paying attention.”</div>
        </div>
      </div>
    </section>
  );
}
