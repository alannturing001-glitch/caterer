import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import apiClient from "@/lib/api";
const ProductsSection = () => {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get("/api/products").then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => setProducts([]));
  }, []);
  return (
    <div className="bg-blue-500 border-t-4 border-white">
      <div className="max-w-screen-2xl mx-auto pt-20">
        <Heading title="FEATURED PRODUCTS" />
        <div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-2 px-10 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {products.length > 0 ? products.map((p: any) => <ProductItem key={p.id} product={p} color="white" />) : (
            <div className="col-span-full text-center text-white py-10"><p>No products available at the moment.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductsSection
