import React from "react";
import Link from "next/link";

import { ImBlog } from "react-icons/im";

const Logo = () => {
  return (
    <Link href="/" className="group flex items-center gap-2 shrink-0">
      <div className="relative">
        <ImBlog className="w-8 h-8 text-amber-600  transition-colors duration-200" />
      </div>

      <div className="flex flex-col">
        <span
          className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-amber-600 via-amber-500 to-pink-500 bg-clip-text text-transparent 
                       animate-gradient bg-size-[200%_auto] group-hover:bg-size-[200%_auto] transition-all duration-300"
        >
          Anik
        </span>

        <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 -mt-1 tracking-wide">
          Travel & Adventure
        </span>
      </div>
    </Link>
  );
};

export default Logo;
