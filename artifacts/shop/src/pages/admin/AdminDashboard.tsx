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
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
          <StatsElement title="Products" value={stats.products} />
          <StatsElement title="Orders" value={stats.orders} />
          <StatsElement title="Users" value={stats.users} />
          <StatsElement title="Revenue" value={`$${stats.revenue}`} />
        </div>
      </main>
    </div>
  );
};
export default AdminDashboard
