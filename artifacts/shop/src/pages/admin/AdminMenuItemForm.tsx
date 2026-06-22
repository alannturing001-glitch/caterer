import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { useLocation } from "wouter";

const CATEGORIES = ["Main Dish", "Side Dish", "Salad", "Dessert", "Drink", "Snack"];
const DIETARY_OPTIONS = ["Vegetarian", "Vegan", "Halal", "Gluten Free", "Dairy Free"];

interface Props { params?: { id?: string } }

const emptyForm = {
  name: "",
  category: "",
  description: "",
  baseCost: "",
  sellingPrice: "",
  pricePerPerson: "",
  available: 1,
  preparationTime: "",
  servingSize: "",
  minimumQuantity: "1",
  dietary: [] as string[],
};

const AdminMenuItemForm = ({ params }: Props) => {
  const isEdit = !!params?.id;
  const [, navigate] = useLocation();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && params?.id) {
      setLoading(true);
      apiClient.get(`/api/menu-items/${params.id}`)
        .then(r => r.json())
        .then(item => {
          if (item?.id) {
            setForm({
              name: item.name || "",
              category: item.category || "",
              description: item.description || "",
              baseCost: String(item.baseCost ?? ""),
              sellingPrice: String(item.sellingPrice ?? ""),
              pricePerPerson: String(item.pricePerPerson ?? ""),
              available: item.available ?? 1,
              preparationTime: item.preparationTime || "",
              servingSize: item.servingSize || "",
              minimumQuantity: String(item.minimumQuantity ?? 1),
              dietary: Array.isArray(item.dietary) ? item.dietary : [],
            });
          }
        })
        .catch(() => toast.error("Failed to load item"))
        .finally(() => setLoading(false));
    }
  }, [isEdit, params?.id]);

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const toggleDietary = (flag: string) => {
    setForm(f => ({
      ...f,
      dietary: f.dietary.includes(flag)
        ? f.dietary.filter(d => d !== flag)
        : [...f.dietary, flag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error("Item name is required"); return; }
    if (!form.category) { toast.error("Category is required"); return; }
    setSaving(true);
    try {
      const body = {
        ...form,
        baseCost: form.baseCost ? Number(form.baseCost) : 0,
        sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : 0,
        pricePerPerson: form.pricePerPerson ? Number(form.pricePerPerson) : 0,
        minimumQuantity: Number(form.minimumQuantity) || 1,
        available: form.available,
      };
      const res = isEdit
        ? await apiClient.put(`/api/menu-items/${params!.id}`, body)
        : await apiClient.post("/api/menu-items", body);
      if (res.ok) {
        toast.success(isEdit ? "Item updated!" : "Item created!");
        navigate("/admin/menu-items");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to save item");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 flex items-center justify-center text-gray-400">Loading…</main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Menu Item" : "Add Menu Item"}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Reusable food items that can be added to packages</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Beef Stew"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                <select value={form.category} onChange={e => set("category", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  rows={3} placeholder="Describe the dish, ingredients, cooking method…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: "baseCost", label: "Base Cost", placeholder: "0" },
                { key: "sellingPrice", label: "Selling Price", placeholder: "0" },
                { key: "pricePerPerson", label: "Cost Per Guest", placeholder: "0" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">KES</span>
                    <input type="number" min="0" value={(form as any)[key]}
                      onChange={e => set(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Availability */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Availability & Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <button type="button"
                  onClick={() => set("available", form.available ? 0 : 1)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${form.available ? "bg-green-500" : "bg-gray-300"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${form.available ? "left-5" : "left-1"}`} />
                </button>
                <div>
                  <div className="text-sm font-medium text-gray-700">Available</div>
                  <div className="text-xs text-gray-400">Show this item in package builder</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time</label>
                <input value={form.preparationTime} onChange={e => set("preparationTime", e.target.value)}
                  placeholder="e.g. 45 minutes"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serving Size</label>
                <input value={form.servingSize} onChange={e => set("servingSize", e.target.value)}
                  placeholder="e.g. Per person 200g"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Quantity</label>
                <input type="number" min="1" value={form.minimumQuantity} onChange={e => set("minimumQuantity", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </section>

          {/* Dietary Information */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Dietary Information</h2>
            <div className="flex flex-wrap gap-3">
              {DIETARY_OPTIONS.map(option => (
                <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors select-none
                  ${form.dietary.includes(option)
                    ? "border-green-500 bg-green-50 text-green-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}>
                  <input type="checkbox" className="hidden"
                    checked={form.dietary.includes(option)}
                    onChange={() => toggleDietary(option)} />
                  <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs
                    ${form.dietary.includes(option) ? "bg-green-500 border-green-500 text-white" : "border-gray-300"}`}>
                    {form.dietary.includes(option) && "✓"}
                  </span>
                  <span className="text-sm font-medium">{option}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={() => { set("available", 0); }}
              className="border border-gray-300 bg-white text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Save as Draft
            </button>
            <button type="submit" disabled={saving}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : isEdit ? "Update Item" : "Publish Item"}
            </button>
            <button type="button" onClick={() => navigate("/admin/menu-items")}
              className="ml-auto text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5">
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminMenuItemForm;
