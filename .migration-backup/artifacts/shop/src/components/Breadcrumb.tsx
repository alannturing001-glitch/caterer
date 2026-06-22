import { Link } from "wouter";
import React from "react";
const Breadcrumb = () => (
  <div className="text-sm pb-6 text-gray-400 flex items-center gap-x-1.5">
    <Link href="/" className="hover:text-green-700 transition-colors">Home</Link>
    <span>/</span>
    <Link href="/packages" className="hover:text-green-700 transition-colors">Packages</Link>
    <span>/</span>
    <span className="text-gray-600">All Packages</span>
  </div>
);
export default Breadcrumb;
