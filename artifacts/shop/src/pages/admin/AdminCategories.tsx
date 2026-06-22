import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";

const EMOJIS = ["💍","🏢","🎂","🍖","🥂","🍼","🍽️","🎓","🕊️","🤝","🎤","🎭","🏋️","🌿","🎪"];

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCat, setNewCat] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🍽️");

  useEffect(() => {
    apiClient.get("/api/categories").then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiClient.post("/api/categories", { name: newCat, icon: selectedEmoji });
    if (res.ok) {
      const d = await res.json();
      setCategories(c => [...c, d]);
      setNewCat("");
      toast.success("Event type added");
    } else toast.error("Failed to add");
  };

  const handleDelete = async (id: number) => {
    const res = await apiClient.delete(`/api/categories/${id}`);
    if (res.ok) { setCategories(c => c.filter((x: any) => x.id !== id)); toast.success("Deleted!"); }
    else toast.error("Failed to delete");
  };

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-2">Event Types</h1>
        <p className="text-gray-500 mb-8">Manage the event type categories shown on your homepage</p>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 max-w-2xl">
          <h2 className="font-bold text-lg mb-4">Add New Event Type</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {EMOJIS.map(e => (
                <button key={e} type="button" onClick={() => setSelectedEmoji(e)}
                  className={`text-2xl w-10 h-10 rounded-lg border-2 transition-colors ${selectedEmoji === e ? "border-blue-500 bg-blue-50" : "border-transparent hover:border-gray-300"}`}>
                  {e}
                </button>
              ))}
            </div>
            <div className="flex gap-x-3">
              <input
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event type name (e.g. Wedding)"
              />
              <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Add
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Icon", "Name", "Slug", "Actions"].map(h => (
                  <th key={h} className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No event types yet</td></tr>
              )}
              {categories.map((c: any) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-2xl">{c.icon || "🍽️"}</td>
                  <td className="p-4 font-medium text-gray-900">{c.name}</td>
                  <td className="p-4 text-gray-400 font-mono text-xs">{c.slug}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 p-1">
                      <FaTrash />
                    </button>
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
export default AdminCategories;
