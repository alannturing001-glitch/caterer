import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get("/api/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-8 overflow-x-auto">
        <h1 className="text-3xl font-bold mb-8">Orders</h1>
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-gray-100">{["ID","Customer","Total","Status","Date"].map(h => <th key={h} className="p-3 text-left">{h}</th>)}</tr></thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.email || o.name || "-"}</td>
                <td className="p-3">${o.total || 0}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${o.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{o.status || "pending"}</span></td>
                <td className="p-3">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};
export default AdminOrders
