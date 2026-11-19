import { FaQuoteLeft } from "react-icons/fa";

export default function Quote() {
  return (
    <section className="bg-[#faf7f0] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <figure className="mx-auto max-w-4xl text-center">
        <FaQuoteLeft aria-hidden="true" className="mx-auto text-2xl text-amber-700/70" />
        <blockquote className="mt-6 font-serif text-2xl leading-relaxed tracking-tight text-stone-800 sm:text-3xl lg:text-4xl">
          “Travel makes one modest. You see what a tiny place you occupy in the world.”
        </blockquote>
        <figcaption className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">Gustave Flaubert</figcaption>
      </figure>
    </section>
  );
}
