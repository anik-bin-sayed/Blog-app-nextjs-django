import React from "react";
import Image from "next/image";
import Link from "next/link";

const Mission = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row overflow-hidden rounded-2xl shadow-xl bg-gray-50">
          <div className="w-full lg:w-1/2">
            <div className="relative h-64 lg:h-full min-h-[320px] overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/3201268/pexels-photo-3201268.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Blog Mission"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-transparent lg:bg-gradient-to-l"></div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              My Blog’s{" "}
              <span className="text-teal-600 relative inline-block">
                Mission
                <span className="absolute bottom-0 left-0 w-full h-1 bg-teal-200 rounded-full -mb-2"></span>
              </span>
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                At the heart of this blog is a simple mission: to inspire,
                educate, and connect. As a marketing professional with a passion
                for travel, technology, and wellness, I aim to share valuable
                insights and personal stories that resonate with you.
              </p>
              <p>
                Join me in this journey of discovery as we explore the world,
                embrace change, and strive for a balanced, fulfilling life.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/subscribe"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-full shadow-md hover:bg-teal-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Subscribe Now
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
