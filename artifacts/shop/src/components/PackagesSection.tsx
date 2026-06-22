import React, { useEffect, useState } from "react";
import PackageItem from "./PackageItem";
import { Link } from "wouter";
import apiClient from "@/lib/api";

const PackagesSection = ({ title = "Popular Packages", limit = 4 }: { title?: string; limit?: number }) => {
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get("/api/products").then(r => r.json())
      .then(d => setPackages(Array.isArray(d) ? d.slice(0, limit) : []))
      .catch(() => setPackages([]));
  }, [limit]);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-screen-2xl mx-auto px-8 max-md:px-5">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Link href="/packages" className="text-green-700 hover:text-green-800 text-sm font-semibold">View all →</Link>
        </div>
        <div className="grid grid-cols-4 gap-5 justify-items-center max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {packages.length > 0 ? packages.map((p: any) => (
            <PackageItem key={p.id} pkg={p} color="light" />
          )) : (
            <div className="col-span-full py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-lg font-medium text-gray-500">No packages yet</p>
              <p className="text-sm mt-1">Seed the database or add packages from the admin panel.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackagesSection;
