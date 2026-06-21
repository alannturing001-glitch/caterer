import { Link } from "wouter";
import React from "react";
import { FaHouse } from "react-icons/fa6";
const Breadcrumb = () => (
  <div className="text-lg pb-10 py-5 max-sm:text-base">
    <ul className="flex gap-x-2 items-center">
      <li><Link href="/" className="flex items-center gap-x-1"><FaHouse className="mr-1" />Home</Link></li>
      <li className="text-gray-400">/</li>
      <li><Link href="/shop">Shop</Link></li>
      <li className="text-gray-400">/</li>
      <li><Link href="/shop">All products</Link></li>
    </ul>
  </div>
);
export default Breadcrumb
