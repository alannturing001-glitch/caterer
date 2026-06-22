import React, { useEffect, useState } from "react";
import PackageItem from "./PackageItem";
import Heading from "./Heading";
import apiClient from "@/lib/api";

const ProductsSection = () => {
  const [packages, setPackages] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get("/api/products").then(r => r.json()).then(d => setPackages(Array.isArray(d) ? d.slice(0, 8) : [])).catch(() => setPackages([]));
  }, []);
  return (
    <div className="bg-blue-600 border-t-4 border-white">
      <div className="max-w-screen-2xl mx-auto pt-20 pb-10">
        <Heading title="FEATURED PACKAGES" />
        <div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-4 px-10 gap-y-10 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {packages.length > 0 ? packages.map((p: any) => <PackageItem key={p.id} pkg={p} color="white" />) : (
            <div className="col-span-full text-center text-white py-10">
              <p className="text-xl mb-2">No packages yet.</p>
              <p className="text-white/70">Add packages from the admin panel.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductsSection;
