import React from "react";
import Card from "../cards/card";
import LinkButton from "../ui/LinkButton";

const LatestBlog = () => {
  const latestPosts = [
    {
      id: 1,
      title: "10 Hidden Gems for Your Next Adventure",
      excerpt:
        "Discover off-the-beaten-path destinations that will make your journey truly unforgettable. From secret beaches to mountain retreats.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop",
      category: "Travel Tips",
      date: "May 18, 2025",
      readTime: "6 min read",
    },
    {
      id: 2,
      title: "Sustainable Travel: How to Explore Responsibly",
      excerpt:
        "Learn eco-friendly practices that help preserve the places you love for future generations. Simple changes make a big difference.",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=500&fit=crop",
      category: "Sustainability",
      date: "May 15, 2025",
      readTime: "4 min read",
    },
    {
      id: 3,
      title: "Ultimate Guide to Solo Travel in 2025",
      excerpt:
        "Essential tips, safety advice, and the best destinations for a solo adventure this year. Travel smarter and safer alone.",
      image:
        "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&h=500&fit=crop",
      category: "Solo Travel",
      date: "May 12, 2025",
      readTime: "7 min read",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-amber-50/30 via-white to-orange-50/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">
            Recent{" "}
            <span className="text-amber-600 relative inline-block">
              Stories
              <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-200 rounded-full -mb-2"></span>
            </span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Fresh insights, travel tips, and inspiring tales from our journeys
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-10">
          {latestPosts.map((post) => (
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

export default LatestBlog;
