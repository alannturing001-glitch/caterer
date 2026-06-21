import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import apiClient from "@/lib/api";

const Products = ({ slug, searchParams }: { slug?: string; searchParams: Record<string, string> }) => {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    const inStockNum = searchParams?.inStock === "true" ? 1 : 0;
    const outOfStockNum = searchParams?.outOfStock === "true" ? 1 : 0;
    const page = searchParams?.page ? Number(searchParams.page) : 1;
    let stockMode = "gt";
    if (inStockNum === 1) stockMode = "equals";
    if (outOfStockNum === 1) stockMode = "lt";
    if (inStockNum === 1 && outOfStockNum === 1) stockMode = "lte";
    if (inStockNum === 0 && outOfStockNum === 0) stockMode = "gt";
    const url = `/api/products?filters[price][$lte]=${searchParams?.price || 3000}&filters[rating][$gte]=${Number(searchParams?.rating) || 0}&filters[inStock][$${stockMode}]=1&${slug ? `filters[category][$equals]=${slug}&` : ""}sort=${searchParams?.sort}&page=${page}`;
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
