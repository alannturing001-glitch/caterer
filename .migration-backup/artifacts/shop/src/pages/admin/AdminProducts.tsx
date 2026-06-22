import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import { Link } from "wouter";
import { FaTrash, FaPencil } from "react-icons/fa6";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get("/api/products").then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await apiClient.delete(`/api/products/${id}`);
    if (res.ok) { setProducts(p => p.filter(x => x.id !== id)); toast.success("Deleted!"); }
    else toast.error("Failed to delete");
  };
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-8 overflow-x-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link href="/admin/products/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">+ Add Product</Link>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-gray-100">{["Image","Title","Price","Stock","Category","Actions"].map(h => <th key={h} className="p-3 text-left">{h}</th>)}</tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3"><img src={p.mainImage ? `/${p.mainImage}` : "/product_placeholder.jpg"} alt="" className="w-16 h-16 object-cover" /></td>
                <td className="p-3">{sanitize(p.title)}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.inStock ? "In Stock" : "Out of Stock"}</td>
                <td className="p-3">{p.category || "-"}</td>
                <td className="p-3 flex gap-x-2">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-blue-500 hover:text-blue-700"><FaPencil /></Link>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};
export default AdminProducts
