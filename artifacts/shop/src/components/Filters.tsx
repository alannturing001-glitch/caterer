import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSortStore } from "@/store/sortStore";
import { usePaginationStore } from "@/store/paginationStore";

const Filters = () => {
  const [location, navigate] = useLocation();
  const { page } = usePaginationStore();
  const [inputCategory, setInputCategory] = useState({
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
  });
  const { sortBy } = useSortStore();
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
    params.set("inStock", inputCategory.inStock.isChecked.toString());
    params.set("rating", inputCategory.ratingFilter.value.toString());
    params.set("price", inputCategory.priceFilter.value.toString());
    params.set("sort", sortBy);
    params.set("page", page.toString());
    navigate(`${location.split('?')[0]}?${params}`);
  }, [inputCategory, sortBy, page]);
  return (
    <div>
      <h3 className="text-2xl mb-2">Filters</h3>
      <div className="divider border-t border-gray-200 my-2"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Availability</h3>
        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input type="checkbox" checked={inputCategory.inStock.isChecked} onChange={() => setInputCategory({...inputCategory, inStock: {text: "instock", isChecked: !inputCategory.inStock.isChecked}})} className="checkbox w-4 h-4 mr-2" />
            <span className="text-lg text-black">In stock</span>
          </label>
        </div>
        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input type="checkbox" checked={inputCategory.outOfStock.isChecked} onChange={() => setInputCategory({...inputCategory, outOfStock: {text: "outofstock", isChecked: !inputCategory.outOfStock.isChecked}})} className="checkbox w-4 h-4 mr-2" />
            <span className="text-lg text-black">Out of stock</span>
          </label>
        </div>
        <h3 className="text-xl mb-2 mt-4">Price</h3>
        <input type="range" min={0} max={3000} value={inputCategory.priceFilter.value} onChange={(e) => setInputCategory({...inputCategory, priceFilter: {text: "price", value: parseInt(e.target.value)}})} className="w-full" />
        <span>Max price: ${inputCategory.priceFilter.value}</span>
      </div>
    </div>
  );
};
export default Filters
