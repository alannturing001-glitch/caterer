import React from "react";
import { Link } from "wouter";

const CATEGORIES = [
  { slug: "weddings", label: "Wedding Catering", emoji: "💍", img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&q=80" },
  { slug: "corporate", label: "Corporate Events", emoji: "🏢", img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=300&q=80" },
  { slug: "birthdays", label: "Birthday Parties", emoji: "🎂", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" },
  { slug: "bbq", label: "Outdoor BBQ", emoji: "🍖", img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&q=80" },
  { slug: "cocktail", label: "Cocktail Events", emoji: "🥂", img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=300&q=80" },
  { slug: "gala", label: "Gala Dinners", emoji: "🍽️", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80" },
];

const CategoryMenu = () => (
  <div className="py-16 bg-white">
    <div className="max-w-screen-2xl mx-auto px-8 max-md:px-5">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Catering for Every Occasion</h2>
        <Link href="/packages" className="text-green-700 hover:text-green-800 text-sm font-semibold">View all →</Link>
      </div>
      <div className="grid grid-cols-6 gap-4 max-xl:grid-cols-3 max-sm:grid-cols-2">
        {CATEGORIES.map(cat => (
          <Link key={cat.slug} href={`/packages/${cat.slug}`}
            className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer block">
            <img
              src={cat.img}
              alt={cat.label}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white font-semibold text-sm leading-tight">{cat.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default CategoryMenu;
