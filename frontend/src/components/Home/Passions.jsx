import Link from "next/link";
import React from "react";
import { FaBookReader } from "react-icons/fa";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdTravelExplore } from "react-icons/md";
import { PiCookingPotFill } from "react-icons/pi";

const passionsData = [
  {
    id: 1,
    icon: <MdTravelExplore />,
    title: "Traveling",
    description: "Exploring new places and cultures to broaden my horizons.",
  },
  {
    id: 2,
    icon: <PiCookingPotFill />,
    title: "Cooking",
    description: "Experimenting with new recipes and flavors in the kitchen.",
  },
  {
    id: 3,
    icon: <HiOutlinePhotograph />,
    title: "Photography",
    description: "Capturing moments and landscapes through my camera lens.",
  },
  {
    id: 4,
    icon: <FaBookReader />,
    title: "Reading",
    description:
      "Diving into books to gain knowledge and escape into different worlds.",
  },
];

const Passions = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-linear-to-br from-white via-amber-50/30 to-orange-50/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
            What Drives{" "}
            <span className="text-amber-600 relative inline-block">
              Me
              <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-200 rounded-full -mb-2"></span>
            </span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            The passions that fuel my creativity and work
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {passionsData.map(({ id, icon, title, description }) => (
            <div
              key={id}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 text-center"
            >
              <div className="flex justify-center">
                <div className="absolute -top-8 inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                  <div className="text-3xl text-amber-600 group-hover:text-amber-700 transition-colors">
                    {icon}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-amber-200 rounded-full group-hover:w-20 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Passions;
