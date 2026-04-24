"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";

const Hero = () => {
  const slides = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=700&fit=crop",
      alt: "Mountain landscape with sunset",
      title: "Inspire. Learn. Grow",
      description:
        "Sharing lessons, experiences and insights to inspire a better tomorrow",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=700&fit=crop",
      alt: "Forest with sunlight rays",
      title: "Life is a collection of moments and words",
      description:
        "Join me as I write about life, travel, productivity and everything in between",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null > null);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1,
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning, currentIndex],
  );

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
  }, [slides.length]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  const currentSlide = slides[currentIndex];

  return (
    <div
      className="relative h-[calc(100vh-65px)] w-full overflow-hidden group"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={currentSlide.url}
          alt={currentSlide.alt}
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-transform duration-700 ease-out scale-105 group-hover:scale-100 ${
            isTransitioning ? "opacity-95" : "opacity-100"
          }`}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

      <div className="absolute inset-0 shadow-inner pointer-events-none" />

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-32 md:pb-40 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transition-all duration-700 delay-100 transform ${
              isTransitioning
                ? "translate-y-4 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
              {currentSlide.title}
            </h1>
            <div className="w-24 h-1 bg-amber-400/80 mx-auto my-6 rounded-full" />
            <p className="text-md md:text-md lg:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
              {currentSlide.description}
            </p>
            <button className="mt-8 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:border-white/50 shadow-lg cursor-pointer">
              Discover More
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div
          key={currentIndex}
          className="h-full bg-amber-400 transition-all duration-5000ms linear"
          style={{ width: "100%" }}
          onAnimationEnd={() => {}}
        />
      </div>
    </div>
  );
};

export default Hero;
