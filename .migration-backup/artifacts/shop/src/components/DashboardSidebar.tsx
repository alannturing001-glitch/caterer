import { Link, useLocation } from "wouter";
import React from "react";
import { FaBox, FaClipboardList, FaUsers, FaChartBar, FaTag, FaStore } from "react-icons/fa6";

const menuItems = [
  { href: "/admin", icon: <FaChartBar />, label: "Dashboard" },
  { href: "/admin/products", icon: <FaBox />, label: "Packages" },
  { href: "/admin/orders", icon: <FaClipboardList />, label: "Quotations" },
  { href: "/admin/categories", icon: <FaTag />, label: "Event Types" },
  { href: "/admin/users", icon: <FaUsers />, label: "Users" },
  { href: "/admin/merchant", icon: <FaStore />, label: "Settings" },
];

const DashboardSidebar = () => {
  const [location] = useLocation();
  return (
    <div className="w-60 bg-green-900 min-h-screen flex flex-col">
      <div className="px-5 py-4 border-b border-green-800/50">
        <div className="flex items-center gap-x-2">
          <span className="text-xl">🍽️</span>
          <div>
            <div className="text-white font-bold text-sm">CaterMarket</div>
            <div className="text-green-400 text-[10px] uppercase tracking-wider">Admin Portal</div>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-y-0.5 p-3 flex-1">
        {menuItems.map((item) => {
          const active = location === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-x-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-amber-500 text-white font-semibold" : "text-green-200 hover:bg-green-800/60 hover:text-white"}`}>
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
export default DashboardSidebar;
