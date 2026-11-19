import Image from "next/image";

export default function AuthShell({ children, visualEyebrow, visualTitle, visualDescription }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#f5f1e9] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-stone-200/80 bg-[#fffdf9] shadow-[0_30px_90px_-45px_rgba(41,32,22,0.4)] md:grid-cols-[1fr_0.9fr]">
        <div className="flex items-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>

        <aside className="relative isolate hidden min-h-[650px] flex-col justify-between overflow-hidden bg-stone-900 p-9 text-white md:flex lg:p-12">
          <Image
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1400&h=1800&fit=crop&auto=format"
            alt="A notebook and pen ready for a new story"
            fill
            sizes="(max-width: 1024px) 45vw, 50vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950/95 via-stone-950/45 to-stone-950/25" />
          <div className="relative inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" /> {visualEyebrow}
          </div>
          <div className="relative max-w-lg">
            <p className="mb-4 font-serif text-5xl leading-none text-amber-200">“</p>
            <h2 className="font-serif text-3xl leading-tight lg:text-4xl">{visualTitle}</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">{visualDescription}</p>
            <div className="mt-8 flex items-center gap-3 border-t border-white/20 pt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
              <span className="h-px w-7 bg-amber-300" /> Globira · Stories & ideas
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
