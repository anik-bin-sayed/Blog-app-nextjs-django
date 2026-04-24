import AboutHero from "@/components/About/AboutHero";
import Mission from "@/components/About/Mission";
import Quote from "@/components/About/Quote";
import Status from "@/components/About/Status";
import Story from "@/components/About/Story";
import Travel from "@/components/About/Travel";
import React from "react";

const page = () => {
  return (
    <div className="bg-linear-to-br from-amber-50 via-white to-orange-50">
      <AboutHero />
      <Status />
      <Quote />
      <Story />
      <Mission />
      <Travel />
    </div>
  );
};

export default page;
