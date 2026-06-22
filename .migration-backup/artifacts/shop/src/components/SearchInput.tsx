import React, { useState } from "react";
import { useLocation } from "wouter";
import { sanitize } from "@/lib/sanitize";
const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [, navigate] = useLocation();
  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedSearch = sanitize(searchInput);
    navigate(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
    setSearchInput("");
  };
  return (
    <form className="flex w-full" onSubmit={searchProducts}>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search packages..."
        className="bg-green-800/60 placeholder-green-400 text-white text-sm w-full rounded-l-lg px-3 py-2 outline-none focus:bg-green-800/80 border border-green-700/50 focus:border-green-500 transition-colors"
      />
      <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-3 py-2 rounded-r-lg transition-colors whitespace-nowrap">
        Search
      </button>
    </form>
  );
};
export default SearchInput;
