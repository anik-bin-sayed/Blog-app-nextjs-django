import React from "react";
import LinkButton from "../ui/LinkButton";
import Card from "../cards/card";

const FeatureBlog = () => {
  const featuredPosts = [
    {
      id: 1,
      title: "10 Hidden Gems for Your Next Adventure",
      excerpt:
        "Discover off-the-beaten-path destinations that will make your journey truly unforgettable.",
      image:
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=600&fit=crop",
      category: "Travel Tips",
      date: "May 15, 2025",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Sustainable Travel: How to Explore Responsibly",
      excerpt:
        "Learn eco-friendly practices that help preserve the places you love for future generations.",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
      category: "Sustainability",
      date: "May 12, 2025",
      readTime: "4 min read",
    },
    {
      id: 3,
      title: "Ultimate Guide to Solo Travel in 2025",
      excerpt:
        "Essential tips, safety advice, and the best destinations for a solo adventure this year.",
      image:
        "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&h=600&fit=crop",
      category: "Solo Travel",
      date: "May 10, 2025",
      readTime: "7 min read",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-linear-to-br from-white via-amber-50/30 to-orange-50/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
            Feature{" "}
            <span className="text-amber-600 relative inline-block">
              Stories
              <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-200 rounded-full -mb-2"></span>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
            Inspiring tales, expert tips, and hidden gems from our travels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-10">
          {featuredPosts.map((post) => (
            <Card key={post.id} post={post} />
          ))}
        </div>

        <div className="text-center mt-12">
          <LinkButton text="View All Blogs" link="/blogs" />
        </div>
      </div>
    </section>
  );
};

export default FeatureBlog;
