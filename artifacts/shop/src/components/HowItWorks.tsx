import React from "react";
const steps = [
  { emoji: "🔍", title: "Browse Packages", desc: "Explore our curated catering packages by event type, budget, or guest count." },
  { emoji: "✏️", title: "Customise Your Menu", desc: "Select menu items, add services, configure your guest count and event date." },
  { emoji: "📋", title: "Request a Quote", desc: "Submit your requirements and receive a detailed quote within 24 hours." },
  { emoji: "🎉", title: "Confirm & Celebrate", desc: "Accept the quote, pay a small deposit, and we handle the rest on your big day." },
];
const HowItWorks = () => (
  <div className="py-20 bg-white">
    <div className="max-w-screen-2xl mx-auto px-8">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
      <p className="text-center text-gray-500 text-lg mb-14">From browse to banquet in four simple steps</p>
      <div className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-y-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl">
              {step.emoji}
            </div>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</div>
            <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default HowItWorks;
