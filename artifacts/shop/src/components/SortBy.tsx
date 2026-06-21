import React from "react";
import { useSortStore } from "@/store/sortStore";
const SortBy = () => {
  const { sortBy, changeSortBy } = useSortStore();
  return (
    <div className="flex items-center gap-x-3">
      <span className="text-sm font-medium text-gray-600">Sort:</span>
      <select value={sortBy} onChange={(e) => changeSortBy(e.target.value)}
        className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700 cursor-pointer">
        <option value="defaultSort">Most Popular</option>
        <option value="titleAsc">Name A–Z</option>
        <option value="titleDesc">Name Z–A</option>
        <option value="lowPrice">Lowest Price</option>
        <option value="highPrice">Highest Price</option>
      </select>
    </div>
  );
};
export default SortBy;
