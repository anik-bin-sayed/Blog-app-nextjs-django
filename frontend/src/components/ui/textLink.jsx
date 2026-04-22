import Link from "next/link";
import React from "react";

const TextLink = ({ text, link }) => {
  return (
    <Link href={link} className="text-amber-600 hover:underline">
      {text}
    </Link>
  );
};

export default TextLink;
