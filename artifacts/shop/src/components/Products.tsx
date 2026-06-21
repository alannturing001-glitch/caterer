import React, { useEffect, useState } from "react";
import PackageItem from "./PackageItem";
import apiClient from "@/lib/api";

const Products = ({ slug, searchParams }: { slug?: string; searchParams: Record<string, string> }) => {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchParams?.price) params.set("price", searchParams.price);
    if (slug) params.set("category", slug);
    if (searchParams?.sort && searchParams.sort !== "defaultSort") params.set("sort", searchParams.sort);
    if (searchParams?.page) params.set("page", searchParams.page);
    if (searchParams?.inStock !== undefined) params.set("inStock", searchParams.inStock);
    const url = `/api/products?${params.toString()}`;
    apiClient.get(url).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => setProducts([]));
  }, [slug, JSON.stringify(searchParams)]);
  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-4 gap-y-8 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.length > 0 ? products.map((p: any) => <PackageItem key={p.id} pkg={p} color="black" />) : (
        <div className="col-span-full py-20 text-center">
          <span className="text-5xl">🍽️</span>
          <h3 className="text-2xl mt-4 text-gray-600">No packages found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your filters or browse all packages</p>
        </div>
      )}
    </div>
  );
};
export default Products;
