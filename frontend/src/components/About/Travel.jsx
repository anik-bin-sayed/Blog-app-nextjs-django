import React from "react";
import Image from "next/image";

const Travel = () => {
  return (
    <div className="py-20">
      <div className="w-[90%] md:w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between relative">
        <div className="relative md:w-1/2 w-full mb-10 md:mb-0 group">
          <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-full h-full border border-gray-300 rounded z-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1"></div>

          <div className="absolute inset-0 bg-linear-to-tr from-teal-200/20 to-purple-200/20 rounded blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

          <div className="relative z-10 w-full h-62.2 md:h-80 rounded overflow-hidden shadow">
            <Image
              src="https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Travel"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={false}
            />
          </div>
        </div>
        <div className="md:w-1/2 w-full flex flex-col items-start justify-start px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl text-gray-600 font-bold italic mb-6 leading-snug">
            Wanderlust:{" "}
            <span className="focused-text text-black">Why I Travel</span>
          </h1>
          <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
            Traveling is more than just a hobby—it’s a way of life that shapes
            my perspective and enriches my soul. Each journey offers a new
            adventure, a chance to step out of my comfort zone and immerse
            myself in diverse cultures and landscapes.
          </p>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            I travel to see the world through different eyes, to learn from the
            stories and traditions of others, and to appreciate the beauty and
            diversity that our planet offers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Travel;
