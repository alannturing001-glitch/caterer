import React, { useEffect, useState } from "react";
import PackageItem from "./PackageItem";
import apiClient from "@/lib/api";

const Products = ({ slug, searchParams }: { slug?: string; searchParams: Record<string, string> }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchParams?.price) params.set("price", searchParams.price);
    if (slug) params.set("category", slug);
    if (searchParams?.sort && searchParams.sort !== "defaultSort") params.set("sort", searchParams.sort);
    if (searchParams?.page) params.set("page", searchParams.page);
    if (searchParams?.inStock !== undefined) params.set("inStock", searchParams.inStock);
    const url = `/api/products?${params.toString()}`;
    apiClient.get(url).then(r => r.json())
      .then(d => { setProducts(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setProducts([]); setLoading(false); });
  }, [slug, JSON.stringify(searchParams)]);

  if (loading) return (
    <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-gray-100 h-[360px] animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-5 justify-items-center max-lg:grid-cols-2 max-sm:grid-cols-1">
      {products.length > 0 ? products.map((p: any) => (
        <PackageItem key={p.id} pkg={p} color="light" />
      )) : (
        <div className="col-span-full py-20 text-center">
          <span className="text-5xl">🍽️</span>
          <h3 className="text-xl mt-4 text-gray-600 font-medium">No packages found</h3>
          <p className="text-gray-400 mt-2 text-sm">Try adjusting your filters or browse all packages</p>
        </div>
      )}
    </div>
  );
};
export default Products;
