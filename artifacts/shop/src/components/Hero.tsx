import React, { useState } from "react";
import { useLocation } from "wouter";

const FOOD_BG = "https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&q=80";

const EVENT_TYPES = [
  "Wedding", "Corporate Event", "Birthday Party", "Outdoor BBQ",
  "Cocktail Reception", "Gala Dinner", "Graduation", "Baby Shower",
];

const Hero = () => {
  const [, navigate] = useLocation();
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("50");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");

  const handleQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (eventType) params.set("category", eventType.toLowerCase().replace(/\s+/g, "-"));
    navigate(`/packages?${params.toString()}`);
  };

  return (
    <div className="relative min-h-[680px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={FOOD_BG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-green-950/80" />
      </div>

      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-8 py-16 max-md:px-5">
        <div className="grid grid-cols-2 gap-16 items-center max-lg:grid-cols-1 max-lg:gap-8">

          {/* Left: Copy */}
          <div className="flex flex-col gap-y-5 max-lg:text-center max-lg:items-center">
            <span className="inline-block bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full w-fit uppercase tracking-wider">
              Premium Catering Marketplace
            </span>
            <h1 className="text-6xl font-bold text-white leading-tight max-xl:text-5xl max-md:text-4xl">
              Find the Perfect<br />Catering for<br />
              <span className="text-amber-400">Any Event</span>
            </h1>
            <p className="text-green-200 text-lg max-w-md leading-relaxed max-md:text-base">
              Compare packages, customise menus, receive instant estimates, and request quotations from trusted professional caterers.
            </p>
            <div className="flex gap-x-3 max-sm:flex-col max-sm:gap-y-3 max-sm:w-full">
              <button onClick={() => navigate("/packages")}
                className="bg-green-700 hover:bg-green-600 text-white font-semibold px-8 py-3.5 text-sm transition-colors flex items-center gap-x-2 justify-center">
                Plan Your Event →
              </button>
              <button onClick={() => navigate("/packages")}
                className="border border-white/30 hover:border-white/60 text-white font-semibold px-8 py-3.5 text-sm transition-colors">
                Browse Packages
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-x-8 mt-6 pt-6 border-t border-white/10 max-sm:gap-x-4 max-sm:flex-wrap max-sm:gap-y-4 max-sm:justify-center">
              {[
                { val: "10K+", label: "Events" },
                { val: "500+", label: "Caterers" },
                { val: "50K+", label: "Guests" },
                { val: "98%", label: "Satisfaction" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{s.val}</div>
                  <div className="text-green-300 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Quote Form */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-lg:max-w-lg max-lg:w-full max-lg:mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Get Instant Quote</h2>
            <p className="text-gray-500 text-sm mb-5">Fill in your event details for an instant estimate</p>
            <form onSubmit={handleQuote} className="flex flex-col gap-y-4">
              {/* Event Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Event Type</label>
                <select value={eventType} onChange={e => setEventType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700">
                  <option value="">Select event type...</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Guest Count</label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button type="button" onClick={() => setGuestCount(g => String(Math.max(10, parseInt(g) - 10)))}
                    className="px-4 py-2.5 text-gray-500 hover:bg-gray-50 text-lg font-bold">−</button>
                  <input type="number" value={guestCount} onChange={e => setGuestCount(e.target.value)} min={10}
                    className="flex-1 text-center text-sm font-semibold text-gray-800 focus:outline-none py-2.5" />
                  <button type="button" onClick={() => setGuestCount(g => String(parseInt(g) + 10))}
                    className="px-4 py-2.5 text-gray-500 hover:bg-gray-50 text-lg font-bold">+</button>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Location</label>
                <input type="text" placeholder="City or venue name" value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-700" />
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Event Date</label>
                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-700" />
              </div>

              <button type="submit"
                className="w-full bg-green-800 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1">
                Get Instant Quote →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
