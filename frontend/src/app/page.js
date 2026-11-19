import FeatureBlog from "@/components/Home/FeatureBlog";
import Hero from "@/components/Home/Hero";
import LatestBlog from "@/components/Home/LatestBlog";
import Passions from "@/components/Home/Passions";

export const metadata = {
  title: "Globira — Stories & Ideas",
  description:
    "A thoughtful collection of ideas, experiences, and places. Find a story and follow where it leads.",
};

export default function HomePage() {
  return (
    <main className="flex-1 bg-[#fffdf9]">
      <Hero />
      <FeatureBlog />
      <Passions />
      <LatestBlog />
    </main>
  );
}
