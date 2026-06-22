import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import SectionTitle from "@/components/SectionTitle";
import ProductItem from "@/components/ProductItem";
import apiClient from "@/lib/api";

const SearchPage = () => {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1] || '');
  const searchQuery = params.get("search") || "";
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    if (searchQuery) {
      apiClient.get(`/api/products/search/${encodeURIComponent(searchQuery)}`).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => setProducts([]));
    }
  }, [searchQuery]);
  return (
    <main>
      <SectionTitle title="SEARCH" path={`Home / Search / ${searchQuery}`} />
      <div className="max-w-screen-2xl mx-auto px-8 pb-20 mt-10">
        <h2 className="text-2xl mb-6">Results for: <span className="font-bold">{searchQuery}</span></h2>
        {products.length === 0 ? (
          <h3 className="text-3xl text-center mt-20">No products found for "{searchQuery}"</h3>
        ) : (
          <div className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {products.map((p: any) => <ProductItem key={p.id} product={p} color="black" />)}
          </div>
        )}
      </div>
    </main>
  );
};
export default SearchPage
