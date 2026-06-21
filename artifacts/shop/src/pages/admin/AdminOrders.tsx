import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  quoted: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  booked: "bg-purple-100 text-purple-800",
  rejected: "bg-red-100 text-red-800",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    apiClient.get("/api/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      const res = await apiClient.put(`/api/orders/${id}`, { status });
      if (res.ok) {
        setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
        toast.success("Status updated");
      } else toast.error("Failed to update");
    } catch { toast.error("Error updating status"); }
    setUpdating(null);
  };

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-8 bg-gray-50 min-h-screen overflow-x-auto">
        <h1 className="text-3xl font-bold mb-2">Quotation Requests</h1>
        <p className="text-gray-500 mb-8">Review and manage all incoming catering quotation requests</p>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["ID", "Contact", "Package", "Event Date", "Guests", "Est. Total", "Status", "Submitted", "Action"].map(h => (
                  <th key={h} className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={9} className="p-8 text-center text-gray-400">No quotation requests yet</td></tr>
              )}
              {orders.map((o: any) => (
                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-mono text-gray-500">#{o.id}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{o.name || "—"}</div>
                    <div className="text-gray-400 text-xs">{o.email || o.phone || "—"}</div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {Array.isArray(o.products) && o.products[0] ? o.products[0].title : "—"}
                  </td>
                  <td className="p-4 text-gray-600">{o.eventDate || "—"}</td>
                  <td className="p-4 text-gray-600">{o.guestCount || "—"}</td>
                  <td className="p-4 font-semibold text-gray-900">${(o.total || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-600"}`}>
                      {o.status || "pending"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-xs">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="p-4">
                    <select
                      value={o.status || "pending"}
                      onChange={e => updateStatus(o.id, e.target.value)}
                      disabled={updating === o.id}
                      className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {["pending", "quoted", "accepted", "booked", "rejected"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
export default AdminOrders;
