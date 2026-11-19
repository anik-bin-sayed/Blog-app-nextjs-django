import React from "react";
import Link from "next/link";


const Logo = ({ position = "header", postion }) => {
  const placement = postion || position;
  return (
    <Link href="/" className="group flex items-center gap-2 shrink-0">
      <div className="flex flex-col">
        <span className={`text-2xl md:text-3xl font-semibold text-black select-none tracking-wide ${placement === "header" ? "text-stone-900" : "text-white"}`}>
          Globir
          <span className="relative">
            a
            <span className="absolute left-0 bottom-0 w-full h-0.75 bg-amber-600"></span>
          </span>
        </span>

        <span className={`pl-2 text-[10px] tracking-[0.12em] -mt-1 select-none md:text-[11px] ${placement === "header" ? "text-stone-500" : "text-stone-400"}`}>
          Stories & Ideas
        </span>
      </div>
    </Link>
  );
};

export default Logo;
