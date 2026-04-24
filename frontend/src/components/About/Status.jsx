import React from "react";
import {
  FaBookOpen,
  FaChartLine,
  FaGlobe,
  FaLanguage,
  FaPenFancy,
} from "react-icons/fa";

const Status = () => {
  const stats = [
    { value: "15", label: "Countries Explored", icon: FaGlobe },
    { value: "10+", label: "Years in Marketing", icon: FaChartLine },
    { value: "200", label: "Blog Posts", icon: FaPenFancy },
    { value: "30", label: "Books / Year", icon: FaBookOpen },
    { value: "3", label: "Languages", icon: FaLanguage },
  ];
  return (
    <div className="py-16 md:py-24 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-linear-to-r from-teal-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full text-amber-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-2xl" />
                  </div>
                  <p className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Status;
