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
    <form className="flex w-full justify-center" onSubmit={searchProducts}>
      <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Type here" className="bg-gray-50 input input-bordered w-[70%] rounded-r-none outline-none focus:outline-none max-sm:w-full border border-gray-300 px-4 py-2" />
      <button type="submit" className="btn bg-blue-500 text-white rounded-l-none rounded-r-xl hover:bg-blue-600 px-4 py-2">Search</button>
    </form>
  );
};
export default SearchInput
