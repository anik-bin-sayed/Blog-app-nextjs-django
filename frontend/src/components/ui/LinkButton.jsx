import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

const LinkButton = ({ link = "/", text = "Button" }) => {
  return (
    <Link
      href={link}
      className="inline-flex items-center px-4 py-2 border-2 border-amber-500 text-amber-600 font-medium rounded-md hover:bg-amber-500 hover:text-white transition-all duration-200"
    >
      {text}
      <FaArrowRight className="h-5 w-5 ml-2" />
    </Link>
  );
};

export default LinkButton;
