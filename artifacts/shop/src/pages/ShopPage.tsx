import React from "react";
import SectionTitle from "@/components/SectionTitle";
import Breadcrumb from "@/components/Breadcrumb";
import Filters from "@/components/Filters";
import SortBy from "@/components/SortBy";
import Products from "@/components/Products";
import Pagination from "@/components/Pagination";
import { useLocation } from "wouter";

const ShopPage = ({ params }: { params?: { slug?: string[] } }) => {
  const [location] = useLocation();
  const queryString = location.split('?')[1] || '';
  const searchParams: Record<string, string> = {};
  new URLSearchParams(queryString).forEach((v, k) => { searchParams[k] = v; });
  const slug = params?.slug?.join('/');

  return (
    <main>
      <SectionTitle title="SHOP" path="Home / Shop" />
      <div className="max-w-screen-2xl mx-auto px-8 pb-20 mt-10 max-sm:px-5">
        <Breadcrumb />
        <div className="flex gap-x-10 max-lg:flex-col">
          <div className="w-64 flex-shrink-0 max-lg:w-full">
            <Filters />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 max-lg:flex-col max-lg:gap-y-4 max-lg:items-start">
              <SortBy />
            </div>
            <Products slug={slug} searchParams={searchParams} />
            <Pagination />
          </div>
        </div>
      </div>
    </main>
  );
};
export default ShopPage
