import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
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
    if (searchParams?.outOfStock !== undefined) params.set("outOfStock", searchParams.outOfStock);
    const url = `/api/products?${params.toString()}`;
    apiClient.get(url).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => setProducts([]));
  }, [slug, JSON.stringify(searchParams)]);
  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.length > 0 ? products.map((p: any) => <ProductItem key={p.id} product={p} color="black" />) : (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">No products found for specified query</h3>
      )}
    </div>
  );
};
export default Products
