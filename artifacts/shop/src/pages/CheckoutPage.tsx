import React, { useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import { useProductStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

const CheckoutPage = () => {
  const { products, total, clearCart } = useProductStore();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({ email: user?.email || "", name: "", address: "", city: "", phone: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (products.length === 0) { toast.error("Your cart is empty"); return; }
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, products, total }),
      });
      if (res.ok) { clearCart(); toast.success("Order placed successfully!"); navigate("/"); }
      else toast.error("Failed to place order");
    } catch { toast.error("Something went wrong"); }
  };
  return (
    <main>
      <SectionTitle title="CHECKOUT" path="Home / Checkout" />
      <div className="max-w-screen-2xl mx-auto px-8 pb-20 mt-10 max-sm:px-5 grid grid-cols-2 gap-x-10 max-lg:grid-cols-1">
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">Billing Details</h2>
          {[["email", "Email"], ["name", "Full Name"], ["address", "Address"], ["city", "City"], ["phone", "Phone"]].map(([field, label]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input name={field} value={(formData as any)[field]} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <button type="submit" className="uppercase bg-white px-4 py-3 text-base border border-black font-bold text-blue-600 shadow-sm hover:bg-gray-100 focus:outline-none mt-4">Place Order</button>
        </form>
        <div className="lg:mt-0 mt-10">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          {products.map(p => <div key={p.id} className="flex justify-between py-2 border-b"><span>{p.title} × {p.amount}</span><span>${(p.price * p.amount).toFixed(2)}</span></div>)}
          <div className="flex justify-between font-bold text-lg mt-4"><span>Total</span><span>${Math.round(total + total / 5 + 5)}</span></div>
        </div>
      </div>
    </main>
  );
};
export default CheckoutPage
