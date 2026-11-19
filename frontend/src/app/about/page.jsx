import AboutHero from "@/components/About/AboutHero";
import Mission from "@/components/About/Mission";
import Quote from "@/components/About/Quote";
import Status from "@/components/About/Status";
import Story from "@/components/About/Story";
import Travel from "@/components/About/Travel";

export const metadata = {
  title: "About Sophia | Globira",
  description:
    "Meet Sophia Ellis: marketer, traveler, and storyteller behind the Globira journal.",
};

export default function AboutPage() {
  return (
    <main className="flex-1 bg-[#fffdf9]">
      <AboutHero />
      <Status />
      <Quote />
      <Story />
      <Mission />
      <Travel />
    </main>
  );
}
