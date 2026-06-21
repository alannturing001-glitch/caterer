import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSortStore } from "@/store/sortStore";
import { usePaginationStore } from "@/store/paginationStore";

const CATEGORIES = [
  { slug: "weddings", label: "Weddings", emoji: "💍" },
  { slug: "corporate", label: "Corporate", emoji: "🏢" },
  { slug: "birthdays", label: "Birthdays", emoji: "🎂" },
  { slug: "bbq", label: "Outdoor BBQ", emoji: "🍖" },
  { slug: "cocktail", label: "Cocktail", emoji: "🥂" },
  { slug: "gala", label: "Gala Dinners", emoji: "🍽️" },
];

const Filters = () => {
  const [location, navigate] = useLocation();
  const { page } = usePaginationStore();
  const [filters, setFilters] = useState({ available: true, priceFilter: 500 });
  const { sortBy } = useSortStore();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("inStock", filters.available.toString());
    params.set("price", (filters.priceFilter * 100).toString());
    params.set("sort", sortBy);
    params.set("page", page.toString());
    navigate(`${location.split("?")[0]}?${params}`);
  }, [filters, sortBy, page]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">Filters</h3>
      </div>

      <div className="p-5 space-y-6">
        {/* Availability */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Availability</h4>
          <label className="flex items-center gap-x-2.5 cursor-pointer">
            <input type="checkbox" checked={filters.available}
              onChange={() => setFilters(f => ({ ...f, available: !f.available }))}
              className="w-4 h-4 rounded accent-green-700" />
            <span className="text-sm text-gray-600">Available packages only</span>
          </label>
        </div>

        {/* Max Price */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Max Price / Guest</h4>
          <input type="range" min={0} max={500} step={5} value={filters.priceFilter}
            onChange={e => setFilters(f => ({ ...f, priceFilter: parseInt(e.target.value) }))}
            className="w-full accent-green-700" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span className="font-semibold text-green-700">${filters.priceFilter}+/guest</span>
            <span>$500+</span>
          </div>
        </div>

        {/* Event Types */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Event Type</h4>
          <div className="flex flex-col gap-y-1">
            {CATEGORIES.map(cat => (
              <a key={cat.slug} href={`/packages/${cat.slug}`}
                className="flex items-center gap-x-2 py-1.5 px-2 rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-800 transition-colors text-sm">
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Filters;
