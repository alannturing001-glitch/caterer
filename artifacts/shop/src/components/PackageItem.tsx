import React from "react";
import { Link } from "wouter";
import { sanitize } from "@/lib/sanitize";

const PackageItem = ({ pkg, color }: { pkg: any; color: string }) => {
  const isWhite = color === "white";
  const textClass = isWhite ? "text-white" : "text-gray-900";
  return (
    <div className="flex flex-col gap-y-3 w-full max-w-[280px]">
      <Link href={`/product/${pkg.slug}`}>
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={pkg.mainImage ? `/${pkg.mainImage}` : "/product_placeholder.jpg"}
            className="w-full h-[200px] object-cover hover:scale-105 transition-transform duration-300"
            alt={sanitize(pkg?.title) || "Package image"}
          />
          {pkg.category && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-1 rounded-full">
              {pkg.category}
            </span>
          )}
        </div>
      </Link>
      <Link href={`/product/${pkg.slug}`} className={`text-lg font-bold mt-1 hover:underline ${textClass}`}>
        {sanitize(pkg.title)}
      </Link>
      <div className="flex items-center gap-x-3">
        {pkg.pricePerPerson ? (
          <p className={`text-base font-semibold ${textClass}`}>
            From <span className="text-yellow-300 text-lg">${pkg.pricePerPerson}</span>/person
          </p>
        ) : (
          <p className={`text-base font-semibold ${textClass}`}>${pkg.price}</p>
        )}
      </div>
      {pkg.minGuests && (
        <p className={`text-sm ${isWhite ? "text-white/70" : "text-gray-500"}`}>
          👥 {pkg.minGuests}–{pkg.maxGuests || "500"} guests
        </p>
      )}
      <Link href={`/product/${pkg.slug}`} className="block text-center uppercase bg-yellow-400 text-blue-900 px-4 py-2 text-sm font-bold hover:bg-yellow-300 transition-colors rounded">
        Request Quote
      </Link>
    </div>
  );
};
export default PackageItem;
