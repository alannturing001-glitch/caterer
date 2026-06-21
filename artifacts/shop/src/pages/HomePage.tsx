import React from "react";
import Hero from "@/components/Hero";
import IntroducingSection from "@/components/IntroducingSection";
import CategoryMenu from "@/components/CategoryMenu";
import ProductsSection from "@/components/ProductsSection";
import Incentives from "@/components/Incentives";
import Newsletter from "@/components/Newsletter";

const HomePage = () => (
  <main>
    <Hero />
    <IntroducingSection />
    <CategoryMenu />
    <ProductsSection />
    <Incentives />
    <Newsletter />
  </main>
);
export default HomePage
