import React, { useState } from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { toast.success("Thanks! We'll be in touch."); setEmail(""); }
  };
  return (
    <div className="py-16 bg-amber-50 border-y border-amber-100">
      <div className="max-w-xl mx-auto px-8 text-center">
        <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-2">Stay Updated</p>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Get Catering Inspiration</h2>
        <p className="text-gray-500 text-sm mb-6">New packages, seasonal menus, and exclusive offers delivered to your inbox.</p>
        <form onSubmit={handleSubmit} className="flex gap-x-2 max-sm:flex-col max-sm:gap-y-2">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button type="submit" className="bg-green-800 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};
export default Newsletter;
