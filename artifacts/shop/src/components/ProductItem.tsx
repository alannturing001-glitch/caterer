import React from "react";
import { Link } from "wouter";
import { sanitize } from "@/lib/sanitize";

const ProductItem = ({ product, color }: { product: any; color: string }) => (
  <div className="flex flex-col items-center gap-y-2">
    <Link href={`/product/${product.slug}`}>
      <img src={product.mainImage ? `/${product.mainImage}` : "/product_placeholder.jpg"} className="w-auto h-[200px] object-cover rounded-xl" alt={sanitize(product?.title) || "Package image"} />
    </Link>
    <Link href={`/product/${product.slug}`} className={color === "black" ? "text-base text-black font-bold mt-2 uppercase" : "text-base text-white font-bold mt-2 uppercase"}>
      {sanitize(product.title)}
    </Link>
    {product.pricePerPerson ? (
      <p className={color === "black" ? "text-sm text-gray-600" : "text-sm text-white/80"}>From ${product.pricePerPerson}/person</p>
    ) : (
      <p className={color === "black" ? "text-base text-black font-semibold" : "text-base text-white font-semibold"}>${product.price}</p>
    )}
    <Link href={`/product/${product?.slug}`} className="block w-full text-center uppercase bg-yellow-400 text-blue-900 py-2 text-sm font-bold hover:bg-yellow-300 transition-colors">
      Request Quote
    </Link>
  </div>
);
export default ProductItem;
