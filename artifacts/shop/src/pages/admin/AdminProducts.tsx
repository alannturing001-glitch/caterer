import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";
import { Link } from "wouter";
import { FaTrash, FaPencil, FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/packages").then(r => r.json())
      .then(d => setPackages(Array.isArray(d) ? d : []))
      .catch(() => toast.error("Failed to load packages"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this package?")) return;
    const res = await apiClient.delete(`/api/packages/${id}`);
    if (res.ok) { setPackages(p => p.filter(x => x.id !== id)); toast.success("Deleted!"); }
    else toast.error("Failed to delete");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
            <p className="text-sm text-gray-500 mt-0.5">Catering packages available for booking</p>
          </div>
          <Link href="/admin/products/new"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <FaPlus size={12} /> Create Package
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">Loading…</div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No packages yet</h3>
            <p className="text-gray-500 mb-6">Create your first catering package to start taking bookings.</p>
            <Link href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
              <FaPlus size={12} /> Create Package
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Cover", "Package Name", "Category", "Pricing", "Guests", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {packages.map(pkg => (
                  <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      {pkg.mainImage
                        ? <img src={pkg.mainImage} alt="" className="w-14 h-14 object-cover rounded-lg" onError={e => (e.currentTarget.style.display = "none")} />
                        : <div className="w-14 h-14 bg-gradient-to-br from-green-700 to-green-500 rounded-lg flex items-center justify-center text-xl">🍽️</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{pkg.title}</div>
                      {pkg.slug && <div className="text-xs text-gray-400">/{pkg.slug}</div>}
                    </td>
                    <td className="px-4 py-3">
                      {pkg.category
                        ? <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{pkg.category}</span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-800">
                        {pkg.pricingModel === "perGuest"
                          ? `KES ${Number(pkg.pricePerPerson || 0).toLocaleString()} / guest`
                          : `KES ${Number(pkg.price || 0).toLocaleString()}`}
                      </div>
                      {pkg.pricingModel && (
                        <div className="text-xs text-gray-400 capitalize">{pkg.pricingModel}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {pkg.minGuests ?? 30} – {pkg.maxGuests ?? 500}
                    </td>
                    <td className="px-4 py-3">
                      {pkg.inStock !== 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/products/${pkg.id}/edit`}
                          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
                          <FaPencil size={13} />
                        </Link>
                        <button onClick={() => handleDelete(pkg.id)}
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

export default AdminProducts;
