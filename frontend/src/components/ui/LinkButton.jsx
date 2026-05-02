import Link from "next/link";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";

const LinkButton = ({ link = "/", text = "Button" }) => {
  return (
    <Link
      href={link}
      className="inline-flex items-center px-4 py-2 outline outline-yellow-500  text-black rounded-full hover:bg-yellow-500 text-sm hover:text-black font-medium transition-all duration-200 hover:border-none"
    >
      {text}
      <IoIosArrowRoundForward className="h-5 w-5 ml-2" />
    </Link>
  );
};

export default LinkButton;
