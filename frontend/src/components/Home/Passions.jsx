import Link from "next/link";
import { FaBookOpen, FaCamera, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { MdTravelExplore } from "react-icons/md";
import { PiCookingPotFill } from "react-icons/pi";

const topics = [
  { icon: MdTravelExplore, title: "Travel", note: "Places, people & perspective", number: "01" },
  { icon: PiCookingPotFill, title: "Food & culture", note: "Good things around the table", number: "02" },
  { icon: FaCamera, title: "Photography", note: "Small moments, held still", number: "03" },
  { icon: FaBookOpen, title: "Reading & ideas", note: "Curiosity with no borders", number: "04" },
];

export default function Passions() {
  return (
    <section className="bg-[#24221e] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Follow your curiosity</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">A little bit of <span className="italic text-amber-200">everything.</span></h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-stone-400">From faraway places to everyday rituals, find a subject that feels like yours.</p>
        </div>
        <div className="mt-10 grid overflow-hidden rounded-2xl border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map(({ icon: Icon, title, note, number }, index) => (
            <Link href="/blogs" key={title} className={`group relative min-h-52 border-white/10 p-6 transition hover:bg-white/[0.06] sm:p-7 ${index > 0 ? "border-t sm:border-l sm:border-t-0" : ""}`}>
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/20 bg-amber-200/10 text-lg text-amber-200 transition group-hover:bg-amber-200 group-hover:text-stone-900"><Icon /></span>
                <span className="font-serif text-sm text-stone-600">{number}</span>
              </div>
              <h3 className="mt-8 font-serif text-xl text-stone-100">{title}</h3>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-sm text-stone-400">{note}</p>
                <FaArrowUpRightFromSquare className="shrink-0 text-xs text-stone-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-200" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
