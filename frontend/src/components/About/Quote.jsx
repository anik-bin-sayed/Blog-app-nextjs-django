import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const Quote = () => {
  return (
    <div className="py-16 md:py-20 bg-teal-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-teal-100">
          <FaQuoteLeft className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <p className="text-xl md:text-2xl font-light italic text-gray-700 leading-relaxed">
            “Travel makes one modest. You see what a tiny place you occupy in
            the world.”
          </p>
          <p className="mt-4 text-amber-600 font-semibold">
            — Gustave Flaubert
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quote;
