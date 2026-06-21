import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCat, setNewCat] = useState("");
  useEffect(() => {
    apiClient.get("/api/categories").then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiClient.post("/api/categories", { name: newCat });
    if (res.ok) { const d = await res.json(); setCategories(c => [...c, d]); setNewCat(""); toast.success("Category added"); }
    else toast.error("Failed to add");
  };
  const handleDelete = async (id: string) => {
    const res = await apiClient.delete(`/api/categories/${id}`);
    if (res.ok) { setCategories(c => c.filter(x => x.id !== id)); toast.success("Deleted!"); }
    else toast.error("Failed to delete");
  };
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Categories</h1>
        <form onSubmit={handleAdd} className="flex gap-x-4 mb-8">
          <input value={newCat} onChange={e => setNewCat(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 flex-1 max-w-md" placeholder="Category name" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Category</button>
        </form>
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-gray-100"><th className="p-3 text-left">Name</th><th className="p-3 text-left">Slug</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {categories.map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.slug || c.name?.toLowerCase()}</td>
                <td className="p-3 text-center"><button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};
export default AdminCategories
