import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { useLocation } from "wouter";

interface Props {
  params?: { id?: string };
}

const AdminProductForm = ({ params }: Props) => {
  const isEdit = !!params?.id;
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    title: "", price: "", category: "", description: "", inStock: "1", mainImage: "", slug: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && params?.id) {
      apiClient.get(`/api/products/${params.id}`)
        .then(r => r.json())
        .then(p => {
          if (p && p.id) {
            setForm({
              title: p.title || "",
              price: String(p.price || ""),
              category: p.category || "",
              description: p.description || "",
              inStock: String(p.inStock ?? "1"),
              mainImage: p.mainImage || "",
              slug: p.slug || "",
            });
          }
        })
        .catch(() => toast.error("Failed to load product"));
    }
  }, [isEdit, params?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { ...form, price: Number(form.price), inStock: Number(form.inStock) };
      const res = isEdit
        ? await apiClient.put(`/api/products/${params!.id}`, body)
        : await apiClient.post("/api/products", body);
      if (res.ok) {
        toast.success(isEdit ? "Product updated!" : "Product created!");
        navigate("/admin/products");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to save product");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">{isEdit ? "Edit Product" : "New Product"}</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-y-5">
          {[
            ["title", "Title", "text"],
            ["slug", "Slug", "text"],
            ["price", "Price", "number"],
            ["category", "Category", "text"],
            ["mainImage", "Main Image URL", "text"],
          ].map(([name, label, type]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input name={name} type={type} value={(form as any)[name]} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <select name="inStock" value={form.inStock} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="1">In Stock</option>
              <option value="0">Out of Stock</option>
            </select>
          </div>
          <div className="flex gap-x-4">
            <button type="submit" disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50">
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
            <button type="button" onClick={() => navigate("/admin/products")}
              className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminProductForm;
