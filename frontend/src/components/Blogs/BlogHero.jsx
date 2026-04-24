const BlogHero = () => {
  return (
    <section className="relative w-full h-[60vh] bg-gray-900">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1600")',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 text-center text-white">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
          Adventures, Stories & Insights Await
        </h1>
        <p className="text-base md:text-lg lg:text-xl max-w-2xl opacity-90 drop-shadow-md">
          Welcome to the heart of my blog, where stories of exploration,
          innovation, and personal growth come to life.
        </p>
      </div>
    </section>
  );
};

export default BlogHero;
