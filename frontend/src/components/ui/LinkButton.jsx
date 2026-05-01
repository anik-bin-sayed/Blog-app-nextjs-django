import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

const LinkButton = ({ link = "/", text = "Button" }) => {
  return (
    <Link
      href={link}
      className="inline-flex items-center px-4 py-2 border-2 border-amber-500 text-yellow-600 rounded-md hover:bg-yellow-500 hover:text-black font-medium transition-all duration-200"
    >
      {text}
      <FaArrowRight className="h-5 w-5 ml-2" />
    </Link>
  );
};

export default LinkButton;
