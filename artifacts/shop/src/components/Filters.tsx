import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSortStore } from "@/store/sortStore";
import { usePaginationStore } from "@/store/paginationStore";

const Filters = () => {
  const [location, navigate] = useLocation();
  const { page } = usePaginationStore();
  const [filters, setFilters] = useState({
    available: true,
    priceFilter: 50000,
    guestMin: 0,
  });
  const { sortBy } = useSortStore();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("inStock", filters.available.toString());
    params.set("price", filters.priceFilter.toString());
    params.set("sort", sortBy);
    params.set("page", page.toString());
    navigate(`${location.split('?')[0]}?${params}`);
  }, [filters, sortBy, page]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>

      <div className="border-t border-gray-100 pt-4 mb-4">
        <h4 className="font-semibold text-gray-700 mb-3">Availability</h4>
        <label className="flex items-center gap-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.available}
            onChange={() => setFilters(f => ({ ...f, available: !f.available }))}
            className="w-4 h-4 rounded accent-blue-600"
          />
          <span className="text-gray-600 text-sm">Available packages only</span>
        </label>
      </div>

      <div className="border-t border-gray-100 pt-4 mb-4">
        <h4 className="font-semibold text-gray-700 mb-3">Max Price per Person</h4>
        <input
          type="range" min={0} max={500} step={5}
          value={filters.priceFilter > 500 ? 500 : filters.priceFilter}
          onChange={e => setFilters(f => ({ ...f, priceFilter: parseInt(e.target.value) }))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$0</span>
          <span className="font-semibold text-blue-600">${filters.priceFilter > 500 ? "500+" : filters.priceFilter}/person</span>
          <span>$500+</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h4 className="font-semibold text-gray-700 mb-3">Event Type</h4>
        <div className="flex flex-col gap-y-2 text-sm text-gray-600">
          {["Wedding", "Corporate", "Birthday", "BBQ", "Gala"].map(type => (
            <a key={type} href={`/packages/${type.toLowerCase()}`}
              className="hover:text-blue-600 hover:underline transition-colors">
              {type}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Filters;
