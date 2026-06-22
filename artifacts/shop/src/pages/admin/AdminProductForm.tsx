import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { useLocation } from "wouter";

const PACKAGE_CATEGORIES = ["Wedding", "Corporate", "Birthday", "Funeral", "Thanksgiving", "Church Event", "Graduation", "Conference"];
const PRICING_MODELS = [
  { id: "fixed", label: "Fixed Price", desc: "One total price regardless of guest count" },
  { id: "perGuest", label: "Price Per Guest", desc: "Multiply cost by number of guests" },
  { id: "dynamic", label: "Dynamic Pricing", desc: "Base price + per-guest rate + add-ons" },
];
const SECTION_DEFS = [
  { key: "mainDishes", label: "Main Dishes", icon: "🍖", categories: ["Main Dish"] },
  { key: "accompaniments", label: "Accompaniments", icon: "🍚", categories: ["Side Dish", "Salad"] },
  { key: "drinks", label: "Drinks", icon: "🥤", categories: ["Drink"] },
  { key: "desserts", label: "Desserts", icon: "🍰", categories: ["Dessert", "Snack"] },
];
const CUSTOMIZATION_RULES = [
  { key: "allowGuestCountChanges", label: "Allow Guest Count Changes" },
  { key: "allowMenuSwaps", label: "Allow Menu Swaps" },
  { key: "allowAdditionalDishes", label: "Allow Additional Dishes" },
  { key: "allowAdditionalDrinks", label: "Allow Additional Drinks" },
  { key: "allowAdditionalDesserts", label: "Allow Additional Desserts" },
  { key: "allowServiceAddons", label: "Allow Service Add-ons" },
];

interface SectionSelection { [sectionKey: string]: number[] }
interface CustomRules { [key: string]: boolean }
interface ServiceRow { name: string; price: string }
interface Props { params?: { id?: string } }

const slugify = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyForm = {
  title: "", slug: "", description: "", category: "", mainImage: "",
  pricingModel: "dynamic",
  minGuests: "30", maxGuests: "500",
  price: "0", pricePerPerson: "0", serviceFee: "0", deliveryFee: "0",
  availableLocations: "", bookingNotice: "", maxEventsPerDay: "5",
  inStock: 1,
};

const AdminProductForm = ({ params }: Props) => {
  const isEdit = !!params?.id;
  const [, navigate] = useLocation();
  const [form, setForm] = useState(emptyForm);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [sections, setSections] = useState<SectionSelection>({ mainDishes: [], accompaniments: [], drinks: [], desserts: [] });
  const [customRules, setCustomRules] = useState<CustomRules>(
    Object.fromEntries(CUSTOMIZATION_RULES.map(r => [r.key, true]))
  );
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    apiClient.get("/api/menu-items").then(r => r.json()).then(d => setMenuItems(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit && params?.id) {
      apiClient.get(`/api/packages/${params.id}`).then(r => r.json()).then(pkg => {
        if (!pkg?.id) return;
        setForm({
          title: pkg.title || "",
          slug: pkg.slug || "",
          description: pkg.description || "",
          category: pkg.category || "",
          mainImage: pkg.mainImage || "",
          pricingModel: pkg.pricingModel || "dynamic",
          minGuests: String(pkg.minGuests ?? 30),
          maxGuests: String(pkg.maxGuests ?? 500),
          price: String(pkg.price ?? 0),
          pricePerPerson: String(pkg.pricePerPerson ?? 0),
          serviceFee: String(pkg.serviceFee ?? 0),
          deliveryFee: String(pkg.deliveryFee ?? 0),
          availableLocations: pkg.availableLocations || "",
          bookingNotice: pkg.bookingNotice || "",
          maxEventsPerDay: String(pkg.maxEventsPerDay ?? 5),
          inStock: pkg.inStock ?? 1,
        });
        if (Array.isArray(pkg.packageSections) && pkg.packageSections.length) {
          const sel: SectionSelection = { mainDishes: [], accompaniments: [], drinks: [], desserts: [] };
          pkg.packageSections.forEach((s: any) => { if (sel[s.key] !== undefined) sel[s.key] = s.selectedIds || []; });
          setSections(sel);
        }
        if (pkg.customizationRules && typeof pkg.customizationRules === "object") {
          setCustomRules(pkg.customizationRules);
        }
      }).catch(() => toast.error("Failed to load package")).finally(() => setLoadingData(false));
    } else {
      setLoadingData(false);
    }
  }, [isEdit, params?.id]);

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const toggleSection = (sectionKey: string, itemId: number) => {
    setSections(s => ({
      ...s,
      [sectionKey]: s[sectionKey].includes(itemId)
        ? s[sectionKey].filter(id => id !== itemId)
        : [...s[sectionKey], itemId],
    }));
  };

  const toggleRule = (key: string) => setCustomRules(r => ({ ...r, [key]: !r[key] }));

  const addService = () => setServices(s => [...s, { name: "", price: "" }]);
  const removeService = (i: number) => setServices(s => s.filter((_, idx) => idx !== i));
  const updateService = (i: number, key: keyof ServiceRow, value: string) =>
    setServices(s => s.map((row, idx) => idx === i ? { ...row, [key]: value } : row));

  const guestCount = Number(form.minGuests) || 30;
  const previewTotal = form.pricingModel === "fixed"
    ? Number(form.price)
    : form.pricingModel === "perGuest"
      ? guestCount * Number(form.pricePerPerson)
      : Number(form.price) + guestCount * Number(form.pricePerPerson) + Number(form.serviceFee);

  const doSubmit = async (stockOverride?: number) => {
    if (!form.title) { toast.error("Package name is required"); return; }
    setSaving(true);
    try {
      const packageSections = SECTION_DEFS.map(s => ({
        key: s.key, label: s.label, selectedIds: sections[s.key],
      }));
      const body = {
        ...form,
        slug: form.slug || slugify(form.title),
        price: Number(form.price) || 0,
        pricePerPerson: Number(form.pricePerPerson) || 0,
        serviceFee: Number(form.serviceFee) || 0,
        deliveryFee: Number(form.deliveryFee) || 0,
        minGuests: Number(form.minGuests) || 30,
        maxGuests: Number(form.maxGuests) || 500,
        maxEventsPerDay: Number(form.maxEventsPerDay) || 5,
        packageSections,
        customizationRules: customRules,
        inStock: stockOverride ?? form.inStock,
      };
      const res = isEdit
        ? await apiClient.put(`/api/packages/${params!.id}`, body)
        : await apiClient.post("/api/packages", body);
      if (res.ok) {
        toast.success(isEdit ? "Package updated!" : "Package created!");
        navigate("/admin/products");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to save package");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) return (
    <div className="flex min-h-screen bg-gray-50"><DashboardSidebar />
      <main className="flex-1 flex items-center justify-center text-gray-400">Loading…</main>
    </div>
  );

  const itemsBySection: Record<string, any[]> = {};
  SECTION_DEFS.forEach(s => {
    itemsBySection[s.key] = menuItems.filter(i => s.categories.includes(i.category));
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 flex gap-6 p-8 overflow-auto">
        {/* Main Form */}
        <div className="flex-1 max-w-2xl space-y-6">
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Package" : "Create Catering Package"}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Build a complete catering package with menu items and pricing</p>
          </div>

          {/* Package Information */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Package Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Package Name <span className="text-red-500">*</span></label>
              <input value={form.title} onChange={e => { set("title", e.target.value); if (!isEdit) set("slug", slugify(e.target.value)); }}
                placeholder="e.g. Corporate Lunch Package"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Package Description <span className="text-red-500">*</span></label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                rows={3} placeholder="Describe what's included, cuisine style, and ideal event type…"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Category <span className="text-red-500">*</span></label>
                <select value={form.category} onChange={e => set("category", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select category…</option>
                  {PACKAGE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                <input value={form.slug} onChange={e => set("slug", e.target.value)}
                  placeholder="auto-generated"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input value={form.mainImage} onChange={e => set("mainImage", e.target.value)}
                  placeholder="https://…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </section>

          {/* Pricing Model */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Pricing Model</h2>
            <div className="grid grid-cols-3 gap-3">
              {PRICING_MODELS.map(m => (
                <label key={m.id} className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-colors
                  ${form.pricingModel === m.id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" name="pricingModel" value={m.id} className="hidden"
                    checked={form.pricingModel === m.id} onChange={() => set("pricingModel", m.id)} />
                  <span className={`text-sm font-semibold mb-0.5 ${form.pricingModel === m.id ? "text-green-800" : "text-gray-800"}`}>{m.label}</span>
                  <span className="text-xs text-gray-500">{m.desc}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guest Requirements</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Minimum Guests</label>
                  <input type="number" min="1" value={form.minGuests} onChange={e => set("minGuests", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <span className="text-gray-400 mt-5">—</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Maximum Guests</label>
                  <input type="number" min="1" value={form.maxGuests} onChange={e => set("maxGuests", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dynamic Pricing Rules</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "price", label: "Base Package Price" },
                  { key: "pricePerPerson", label: "Cost Per Guest" },
                  { key: "serviceFee", label: "Service Fee" },
                  { key: "deliveryFee", label: "Delivery Fee" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">KES</span>
                      <input type="number" min="0" value={(form as any)[key]}
                        onChange={e => set(key, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <strong>Formula:</strong> Total = Base Price + (Guests × Cost/Guest) + Add-ons + Delivery Fee
              </div>
            </div>
          </section>

          {/* Package Builder */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Package Builder</h2>
            {menuItems.length === 0 && (
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 text-center">
                No menu items yet.{" "}
                <a href="/admin/menu-items/new" className="text-green-700 underline">Add menu items first</a> to build your package.
              </div>
            )}
            {SECTION_DEFS.map(section => {
              const available = itemsBySection[section.key] || [];
              const selected = sections[section.key];
              return (
                <div key={section.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <span>{section.icon}</span>
                    <span className="text-sm font-semibold text-gray-800">{section.label}</span>
                    {selected.length > 0 && (
                      <span className="ml-auto text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">{selected.length} selected</span>
                    )}
                  </div>
                  {available.length === 0 ? (
                    <p className="text-xs text-gray-400 italic pl-6">No {section.label.toLowerCase()} items available</p>
                  ) : (
                    <div className="pl-6 grid grid-cols-2 gap-2">
                      {available.map((item: any) => (
                        <label key={item.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors text-sm
                          ${selected.includes(item.id) ? "border-green-500 bg-green-50 text-green-800" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}>
                          <input type="checkbox" className="hidden"
                            checked={selected.includes(item.id)}
                            onChange={() => toggleSection(section.key, item.id)} />
                          <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-xs
                            ${selected.includes(item.id) ? "bg-green-500 border-green-500 text-white" : "border-gray-300"}`}>
                            {selected.includes(item.id) && "✓"}
                          </span>
                          <span className="truncate">{item.name}</span>
                          {item.pricePerPerson > 0 && (
                            <span className="ml-auto text-xs text-gray-400 flex-shrink-0">KES {Number(item.pricePerPerson).toLocaleString()}</span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* Customization Rules */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Customization Rules</h2>
            <div className="grid grid-cols-2 gap-2">
              {CUSTOMIZATION_RULES.map(rule => (
                <label key={rule.key}
                  onClick={() => toggleRule(rule.key)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${customRules[rule.key] ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <div className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0
                    ${customRules[rule.key] ? "bg-green-500" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm
                      ${customRules[rule.key] ? "left-4" : "left-0.5"}`} />
                  </div>
                  <span className="text-sm text-gray-700">{rule.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Additional Services */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-900">Additional Services</h2>
              <button type="button" onClick={addService}
                className="text-xs text-green-700 border border-green-500 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors">
                + Add Service
              </button>
            </div>
            {services.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Add optional services: waiters, tent, chairs, sound system…</p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 text-xs text-gray-500 px-1">
                  <span>Service Name</span><span>Price (KES)</span><span></span>
                </div>
                {services.map((svc, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
                    <input value={svc.name} onChange={e => updateService(i, "name", e.target.value)}
                      placeholder="e.g. Waiters"
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <input type="number" value={svc.price} onChange={e => updateService(i, "price", e.target.value)}
                      placeholder="5000"
                      className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <button type="button" onClick={() => removeService(i)}
                      className="text-red-400 hover:text-red-600 px-2 text-xl leading-none">×</button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Availability */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Availability</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Locations</label>
                <input value={form.availableLocations} onChange={e => set("availableLocations", e.target.value)}
                  placeholder="e.g. Nairobi, Mombasa, Kisumu"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Notice</label>
                <input value={form.bookingNotice} onChange={e => set("bookingNotice", e.target.value)}
                  placeholder="e.g. 7 days in advance"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Events Per Day</label>
                <input type="number" min="1" value={form.maxEventsPerDay} onChange={e => set("maxEventsPerDay", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => set("inStock", form.inStock ? 0 : 1)}>
                <div className={`w-10 h-6 rounded-full transition-colors relative ${form.inStock ? "bg-green-500" : "bg-gray-300"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${form.inStock ? "left-5" : "left-1"}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Available for Booking</div>
                  <div className="text-xs text-gray-400">Show this package on the marketplace</div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex gap-3 pb-8">
            <button type="button" onClick={() => doSubmit(0)}
              className="border border-gray-300 bg-white text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Save Draft
            </button>
            <button type="button" onClick={() => doSubmit()} disabled={saving}
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : isEdit ? "Update Package" : "Publish Package"}
            </button>
            <button type="button" onClick={() => navigate("/admin/products")}
              className="ml-auto text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5">
              Cancel
            </button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <aside className="w-72 flex-shrink-0 sticky top-8 self-start space-y-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Live Preview</div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {form.mainImage ? (
              <img src={form.mainImage} alt="" className="w-full h-36 object-cover" onError={e => (e.currentTarget.style.display = "none")} />
            ) : (
              <div className="w-full h-36 bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center text-5xl">🍽️</div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-base mb-1">{form.title || "Package Name"}</h3>
              {form.category && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{form.category}</span>}
              <div className="mt-3 mb-3">
                <div className="text-xs text-gray-500">Starting from</div>
                <div className="text-xl font-bold text-green-700">
                  {form.pricingModel === "perGuest"
                    ? `KES ${Number(form.pricePerPerson).toLocaleString()} / Guest`
                    : `KES ${previewTotal.toLocaleString()}`}
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                {SECTION_DEFS.map(s => sections[s.key].length > 0 && (
                  <div key={s.key} className="flex items-center gap-2">
                    <span className="text-green-600 text-xs">✓</span>
                    <span>{sections[s.key].length} {s.label}</span>
                  </div>
                ))}
              </div>
              {(form.minGuests || form.maxGuests) && (
                <div className="text-xs text-gray-500 border-t pt-2">
                  Guests: {form.minGuests} – {form.maxGuests}
                </div>
              )}
              <button type="button" className="mt-3 w-full bg-amber-500 text-white text-sm font-medium py-2 rounded-lg">
                Customize Package
              </button>
            </div>
          </div>

          {form.pricingModel === "dynamic" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-amber-800 mb-2 uppercase tracking-wider">Price Breakdown</div>
              <div className="space-y-1.5 text-xs text-amber-900">
                <div className="flex justify-between"><span>Base Price</span><span>KES {Number(form.price).toLocaleString()}</span></div>
                <div className="flex justify-between">
                  <span>{form.minGuests}g × KES {Number(form.pricePerPerson).toLocaleString()}</span>
                  <span>KES {(Number(form.minGuests) * Number(form.pricePerPerson)).toLocaleString()}</span>
                </div>
                {Number(form.serviceFee) > 0 && (
                  <div className="flex justify-between"><span>Service Fee</span><span>KES {Number(form.serviceFee).toLocaleString()}</span></div>
                )}
                {Number(form.deliveryFee) > 0 && (
                  <div className="flex justify-between"><span>Delivery Fee</span><span>KES {Number(form.deliveryFee).toLocaleString()}</span></div>
                )}
                <div className="flex justify-between font-semibold border-t border-amber-300 pt-1.5 mt-1.5">
                  <span>Total (min. guests)</span><span>KES {previewTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default AdminProductForm;
