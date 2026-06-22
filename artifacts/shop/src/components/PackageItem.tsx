import React from "react";
import { Link } from "wouter";
import { sanitize } from "@/lib/sanitize";

const FOOD_IMAGES: Record<string, string> = {
  "elegant-wedding-buffet": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
  "garden-wedding-package": "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=600&q=80",
  "corporate-lunch-box": "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80",
  "executive-boardroom": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  "birthday-fiesta": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "classic-bbq-cookout": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
  "champagne-cocktail-reception": "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80",
  "black-tie-gala-dinner": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80";

const BADGES: Record<string, { label: string; cls: string }> = {
  "elegant-wedding-buffet": { label: "Most Popular", cls: "bg-amber-400 text-amber-900" },
  "black-tie-gala-dinner": { label: "Premium", cls: "bg-green-700 text-white" },
  "classic-bbq-cookout": { label: "Best Seller", cls: "bg-orange-500 text-white" },
  "corporate-lunch-box": { label: "Most Popular", cls: "bg-amber-400 text-amber-900" },
};

const TAGS: string[] = ["Main Dishes", "Drinks", "Desserts"];

const PackageItem = ({ pkg, color }: { pkg: any; color?: string }) => {
  const imgSrc = pkg.mainImage ? `/${pkg.mainImage}` : (FOOD_IMAGES[pkg.slug] || FALLBACK_IMG);
  const badge = BADGES[pkg.slug];
  const isLight = color !== "white";

  return (
    <div className={`flex flex-col rounded-2xl overflow-hidden border ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-white/5"} w-full max-w-[300px] shadow-sm hover:shadow-md transition-shadow`}>
      {/* Image */}
      <div className="relative overflow-hidden h-[180px]">
        <img src={imgSrc} alt={sanitize(pkg.title)} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
        {badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors text-sm">
          ♡
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-y-2.5 p-4 flex-1">
        <Link href={`/product/${pkg.slug}`} className="font-bold text-gray-900 hover:text-green-800 transition-colors text-base leading-snug line-clamp-2">
          {sanitize(pkg.title)}
        </Link>
        {pkg.description && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{pkg.description.replace(/<[^>]*>/g, "")}</p>
        )}

        {/* Price + Rating */}
        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="text-xs text-gray-400">Starting from</span>
            <div className="font-bold text-green-800 text-base">
              {pkg.pricePerPerson ? `$${pkg.pricePerPerson}` : `$${pkg.price}`}
              <span className="text-xs font-normal text-gray-500"> / guest</span>
            </div>
          </div>
          <div className="flex items-center gap-x-1 text-xs text-gray-500">
            <span className="text-amber-400">★</span>
            <span className="font-semibold text-gray-700">4.9</span>
            <span>(120)</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-x-1.5 flex-wrap gap-y-1">
          {TAGS.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full">{tag}</span>
          ))}
          {pkg.minGuests && (
            <span className="bg-green-50 text-green-700 text-[10px] font-medium px-2 py-0.5 rounded-full">👥 {pkg.minGuests}+ guests</span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-x-2 mt-auto pt-2">
          <Link href={`/product/${pkg.slug}`}
            className="flex-1 text-center bg-green-800 hover:bg-green-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors">
            Customize
          </Link>
          <Link href={`/product/${pkg.slug}`}
            className="flex-1 text-center border border-gray-200 hover:border-green-600 hover:text-green-700 text-gray-700 text-xs font-semibold py-2.5 rounded-lg transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageItem;
