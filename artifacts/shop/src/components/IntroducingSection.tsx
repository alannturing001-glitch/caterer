import React from "react";
import { Link } from "wouter";
const IntroducingSection = () => (
  <div className="py-20 pt-24 bg-gradient-to-l from-white to-blue-600">
    <div className="text-center flex flex-col gap-y-5 items-center">
      <h2 className="text-white text-7xl font-extrabold text-center mb-2 max-md:text-5xl max-[480px]:text-4xl">
        CATERING FOR <span className="text-yellow-300">EVERY</span> OCCASION
      </h2>
      <div>
        <p className="text-white text-center text-2xl font-semibold max-md:text-xl max-[480px]:text-base">Request a custom quote in minutes.</p>
        <p className="text-white text-center text-2xl font-semibold max-md:text-xl max-[480px]:text-base">Premium food, professional service.</p>
        <Link href="/packages" className="block text-blue-600 bg-white font-bold px-12 py-3 text-xl hover:bg-gray-100 w-96 mt-4 max-md:text-lg max-md:w-72 max-[480px]:w-60 mx-auto text-center">
          BROWSE PACKAGES
        </Link>
      </div>
    </div>
  </div>
);
export default IntroducingSection;
