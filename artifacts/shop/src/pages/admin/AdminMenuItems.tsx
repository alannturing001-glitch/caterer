import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";
import { Link } from "wouter";
import { FaTrash, FaPencil, FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";

const CATEGORY_COLORS: Record<string, string> = {
  "Main Dish": "bg-amber-100 text-amber-800",
  "Side Dish": "bg-green-100 text-green-800",
  "Salad": "bg-lime-100 text-lime-800",
  "Dessert": "bg-pink-100 text-pink-800",
  "Drink": "bg-blue-100 text-blue-800",
  "Snack": "bg-purple-100 text-purple-800",
};

const AdminMenuItems = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/menu-items")
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => toast.error("Failed to load menu items"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this menu item?")) return;
    const res = await apiClient.delete(`/api/menu-items/${id}`);
    if (res.ok) {
      setItems(p => p.filter(x => x.id !== id));
      toast.success("Deleted!");
    } else {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
            <p className="text-sm text-gray-500 mt-0.5">Reusable food items used inside packages</p>
          </div>
          <Link href="/admin/menu-items/new"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <FaPlus size={12} /> Add Item
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No menu items yet</h3>
            <p className="text-gray-500 mb-6">Create reusable food items that you'll add to packages.</p>
            <Link href="/admin/menu-items/new"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
              <FaPlus size={12} /> Add your first item
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Name", "Category", "Cost/Guest", "Selling Price", "Dietary", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.description && <div className="text-xs text-gray-400 truncate max-w-xs">{item.description}</div>}
                    </td>
                    <td className="px-4 py-3">
                      {item.category ? (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category] || "bg-gray-100 text-gray-700"}`}>
                          {item.category}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.pricePerPerson ? `KES ${Number(item.pricePerPerson).toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.sellingPrice ? `KES ${Number(item.sellingPrice).toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(item.dietary) && item.dietary.length > 0
                          ? item.dietary.slice(0, 3).map((d: string) => (
                              <span key={d} className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">{d}</span>
                            ))
                          : <span className="text-gray-400 text-xs">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.available !== 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" /> Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/menu-items/${item.id}/edit`}
                          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
                          <FaPencil size={13} />
                        </Link>
                        <button onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMenuItems;
