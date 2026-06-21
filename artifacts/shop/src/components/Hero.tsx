import React from "react";
import { Link } from "wouter";
const Hero = () => (
  <div className="min-h-[600px] w-full bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 max-lg:min-h-[700px]">
    <div className="grid grid-cols-2 items-center justify-items-center px-16 gap-x-10 max-w-screen-2xl mx-auto min-h-[600px] py-10 max-lg:grid-cols-1 max-lg:py-16 max-lg:gap-y-10">
      <div className="flex flex-col gap-y-6 max-lg:order-last max-lg:text-center max-lg:items-center">
        <div className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full w-fit">Premium Catering Services</div>
        <h1 className="text-6xl text-white font-bold leading-tight max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">
          Unforgettable Events<br /><span className="text-yellow-300">Start With Great Food</span>
        </h1>
        <p className="text-white/90 text-lg max-w-md max-sm:text-base">
          Discover premium catering packages for every occasion. Customize your menu, get an instant quote, and let us handle the rest.
        </p>
        <div className="flex gap-x-3 max-sm:flex-col max-sm:gap-y-3 max-sm:w-full">
          <Link href="/packages" className="bg-yellow-400 text-blue-900 font-bold px-10 py-4 text-base hover:bg-yellow-300 transition-colors text-center">
            BROWSE PACKAGES
          </Link>
          <Link href="/packages" className="bg-white/10 border-2 border-white text-white font-bold px-10 py-4 text-base hover:bg-white/20 transition-colors text-center">
            GET A QUOTE
          </Link>
        </div>
        <div className="flex gap-x-8 text-white/80 text-sm max-sm:gap-x-4">
          <span>✓ 500+ Events Catered</span>
          <span>✓ 50+ Menu Options</span>
          <span>✓ 100% Satisfaction</span>
        </div>
      </div>
      <div className="relative flex items-center justify-center">
        <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center max-md:w-64 max-md:h-64">
          <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center max-md:w-52 max-md:h-52">
            <span className="text-9xl max-md:text-8xl">🍽️</span>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 bg-yellow-400 text-blue-900 rounded-2xl px-4 py-2 font-bold text-sm shadow-lg">
          From $25/person
        </div>
        <div className="absolute -bottom-2 -left-4 bg-white rounded-2xl px-4 py-2 font-bold text-sm text-blue-700 shadow-lg">
          ⭐ 4.9 / 5 Rating
        </div>
      </div>
    </div>
  </div>
);
export default Hero;
