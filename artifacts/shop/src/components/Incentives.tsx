import React from "react";

const items = [
  { icon: "🏆", title: "Verified Caterers Only", desc: "Every caterer on our platform is vetted, licensed, insured, and reviewed by real customers." },
  { icon: "💰", title: "Transparent Pricing", desc: "No hidden fees. All costs — food, service, setup — are calculated live before you submit." },
  { icon: "👤", title: "Dedicated Event Planner", desc: "A personal planner guides you from your first quote to the last dish served at your event." },
];

const Incentives = () => (
  <div className="py-16 bg-green-900">
    <div className="max-w-screen-2xl mx-auto px-8 max-md:px-5">
      <h2 className="text-2xl font-bold text-white text-center mb-2">Why Choose CaterMarket</h2>
      <p className="text-green-300 text-center text-sm mb-10">The catering experience you deserve</p>
      <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1 max-w-4xl mx-auto">
        {items.map(item => (
          <div key={item.title} className="bg-green-800/50 border border-green-700/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-green-300 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Incentives;
