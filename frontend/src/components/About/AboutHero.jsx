import React from "react";

const AboutHero = () => {
  return (
    <section className="relative w-full h-[80vh] bg-gray-900">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg?auto=compress&cs=tinysrgb&w=1600")',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 text-center text-white">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
          From Marketing Maven to <br className="hidden sm:block" />
          World Explorer
        </h1>
        <p className="text-base md:text-lg lg:text-xl max-w-3xl opacity-95 drop-shadow-md leading-relaxed">
          Hi there! I’m Sophia Ellis, a marketing professional with a zest for
          life and an insatiable curiosity for the world. This blog is where my
          love for storytelling, discovery, and personal growth converge.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
