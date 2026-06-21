import React from "react";
import Hero from "@/components/Hero";
import IntroducingSection from "@/components/IntroducingSection";
import CategoryMenu from "@/components/CategoryMenu";
import PackagesSection from "@/components/PackagesSection";
import Incentives from "@/components/Incentives";
import Newsletter from "@/components/Newsletter";
import HowItWorks from "@/components/HowItWorks";

const HomePage = () => (
  <main>
    <Hero />
    <IntroducingSection />
    <CategoryMenu />
    <HowItWorks />
    <PackagesSection />
    <Incentives />
    <Newsletter />
  </main>
);
export default HomePage;
