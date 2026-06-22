import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import StatsElement from "@/components/StatsElement";
import apiClient from "@/lib/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  useEffect(() => {
    apiClient.get("/api/admin/stats").then(r => r.json()).then(d => setStats(d)).catch(() => {});
  }, []);
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome to the CaterMarket admin panel</p>
        <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
          <StatsElement title="Packages" value={stats.products} />
          <StatsElement title="Quotations" value={stats.orders} />
          <StatsElement title="Users" value={stats.users} />
          <StatsElement title="Est. Revenue" value={`$${stats.revenue.toLocaleString()}`} />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6 max-lg:grid-cols-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-y-3">
              <a href="/admin/products/new" className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">+ Add New Package</a>
              <a href="/admin/orders" className="block w-full text-center bg-yellow-400 text-blue-900 font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-colors">View All Quotations</a>
              <a href="/admin/categories" className="block w-full text-center border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors">Manage Event Types</a>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Quotation Status Legend</h2>
            <div className="flex flex-col gap-y-3 text-sm">
              {[
                { status: "pending", color: "bg-yellow-100 text-yellow-800", label: "Pending — New request awaiting review" },
                { status: "quoted", color: "bg-blue-100 text-blue-800", label: "Quoted — Quote sent to customer" },
                { status: "accepted", color: "bg-green-100 text-green-800", label: "Accepted — Customer accepted the quote" },
                { status: "booked", color: "bg-purple-100 text-purple-800", label: "Booked — Deposit paid, event confirmed" },
                { status: "rejected", color: "bg-red-100 text-red-800", label: "Rejected — Customer declined" },
              ].map(s => (
                <div key={s.status} className="flex items-center gap-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold w-20 text-center ${s.color}`}>{s.status}</span>
                  <span className="text-gray-600">{s.label.split("— ")[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default AdminDashboard;
