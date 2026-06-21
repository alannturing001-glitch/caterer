import { Link, useLocation } from "wouter";
import React from "react";
import { FaBox, FaClipboardList, FaUsers, FaChartBar, FaTag, FaStore } from "react-icons/fa6";
const menuItems = [
  { href: "/admin", icon: <FaChartBar />, label: "Dashboard" },
  { href: "/admin/products", icon: <FaBox />, label: "Products" },
  { href: "/admin/orders", icon: <FaClipboardList />, label: "Orders" },
  { href: "/admin/users", icon: <FaUsers />, label: "Users" },
  { href: "/admin/categories", icon: <FaTag />, label: "Categories" },
  { href: "/admin/merchant", icon: <FaStore />, label: "Merchant" },
];
const DashboardSidebar = () => {
  const [location] = useLocation();
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <nav className="flex flex-col gap-y-1">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className={`flex items-center gap-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location === item.href ? "bg-blue-50 text-blue-600 font-semibold" : ""}`}>
            {item.icon}<span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
export default DashboardSidebar
