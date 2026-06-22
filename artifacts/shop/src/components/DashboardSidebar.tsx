import { Link, useLocation } from "wouter";
import React, { useState } from "react";
import { FaBox, FaClipboardList, FaUsers, FaChartBar, FaTag, FaStore, FaUtensils, FaChevronDown, FaChevronRight } from "react-icons/fa6";

interface NavItem {
  href?: string;
  icon: React.ReactNode;
  label: string;
  children?: { href: string; label: string }[];
}

const navItems: NavItem[] = [
  { href: "/admin", icon: <FaChartBar />, label: "Overview" },
  {
    icon: <FaBox />, label: "Packages",
    children: [
      { href: "/admin/products", label: "All Packages" },
      { href: "/admin/products/new", label: "Create Package" },
    ],
  },
  {
    icon: <FaUtensils />, label: "Menu Items",
    children: [
      { href: "/admin/menu-items", label: "All Items" },
      { href: "/admin/menu-items/new", label: "Add Item" },
    ],
  },
  { href: "/admin/orders", icon: <FaClipboardList />, label: "Quotations" },
  { href: "/admin/categories", icon: <FaTag />, label: "Event Types" },
  { href: "/admin/users", icon: <FaUsers />, label: "Users" },
  { href: "/admin/merchant", icon: <FaStore />, label: "Settings" },
];

const DashboardSidebar = () => {
  const [location] = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "Packages": location.startsWith("/admin/products"),
    "Menu Items": location.startsWith("/admin/menu-items"),
  });

  const toggle = (label: string) => setExpanded(e => ({ ...e, [label]: !e[label] }));

  return (
    <div className="w-60 bg-green-900 min-h-screen flex flex-col flex-shrink-0">
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
        {navItems.map((item) => {
          if (item.children) {
            const isOpen = expanded[item.label];
            const anyChildActive = item.children.some(c => location === c.href);
            return (
              <div key={item.label}>
                <button onClick={() => toggle(item.label)}
                  className={`w-full flex items-center gap-x-3 px-4 py-2.5 rounded-lg text-sm transition-colors
                    ${anyChildActive ? "text-white bg-green-800/60" : "text-green-200 hover:bg-green-800/60 hover:text-white"}`}>
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className="text-xs opacity-60">{isOpen ? <FaChevronDown /> : <FaChevronRight />}</span>
                </button>
                {isOpen && (
                  <div className="ml-4 mt-0.5 flex flex-col gap-y-0.5">
                    {item.children.map(child => (
                      <Link key={child.href} href={child.href}
                        className={`flex items-center gap-x-2 px-4 py-2 rounded-lg text-xs transition-colors
                          ${location === child.href ? "bg-amber-500 text-white font-semibold" : "text-green-300 hover:bg-green-800/60 hover:text-white"}`}>
                        <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          const active = location === item.href;
          return (
            <Link key={item.href} href={item.href!}
              className={`flex items-center gap-x-3 px-4 py-2.5 rounded-lg text-sm transition-colors
                ${active ? "bg-amber-500 text-white font-semibold" : "text-green-200 hover:bg-green-800/60 hover:text-white"}`}>
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
