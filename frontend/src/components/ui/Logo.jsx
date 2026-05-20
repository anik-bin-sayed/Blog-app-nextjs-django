import React from "react";
import Link from "next/link";


const Logo = ({postion="header"}) => {
  return (
    <Link href="/" className="group flex items-center gap-2 shrink-0">
      <div className="flex flex-col">
        <span className={`text-2xl md:text-3xl font-medium text-black select-none tracking-wide ${postion === "header" ? "text-black" : "text-white"}`}>
          Globir
          <span className="relative">
            a
            <span className="absolute left-0 bottom-0 w-full h-0.75 bg-amber-600"></span>
          </span>
        </span>

        <span className={`text-[10px] pl-2 md:text-xs text-gray-500  -mt-1 tracking-wide select-none ${postion === "header" ? "text-gray-500" : "text-white"}`}>
          Travel & Adventure
        </span>
      </div>
    </Link>
  );
};

export default Logo;
