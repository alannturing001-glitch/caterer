import React from "react";
import Hero from "@/components/Hero";
import CategoryMenu from "@/components/CategoryMenu";
import PackagesSection from "@/components/PackagesSection";
import Incentives from "@/components/Incentives";
import Newsletter from "@/components/Newsletter";
import HowItWorks from "@/components/HowItWorks";

const HomePage = () => (
  <main>
    <Hero />
    <CategoryMenu />
    <HowItWorks />
    <PackagesSection title="Popular Packages" limit={8} />
    <Incentives />
    <Newsletter />
  </main>
);
export default HomePage;
