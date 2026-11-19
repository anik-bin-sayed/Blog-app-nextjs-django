import { FaBookOpen, FaChartLine, FaGlobe, FaLanguage, FaPenFancy } from "react-icons/fa";

const stats = [
  { value: "15", label: "Countries explored", icon: FaGlobe },
  { value: "10+", label: "Years in marketing", icon: FaChartLine },
  { value: "200", label: "Stories published", icon: FaPenFancy },
  { value: "30", label: "Books each year", icon: FaBookOpen },
  { value: "3", label: "Languages", icon: FaLanguage },
];

export default function Status() {
  return (
    <section className="bg-[#fffdf9] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-5">
        {stats.map(({ value, label, icon: Icon }) => (
          <div key={label} className="group flex items-center gap-3 p-4 transition hover:bg-[#faf7f0] sm:justify-center sm:gap-3 sm:p-5 lg:flex-col lg:gap-2 lg:py-6">
            <Icon aria-hidden="true" className="shrink-0 text-lg text-amber-800 transition group-hover:scale-110" />
            <div className="lg:text-center">
              <p className="font-serif text-2xl leading-none text-stone-900 sm:text-3xl">{value}</p>
              <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-stone-500 sm:text-[11px]">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
