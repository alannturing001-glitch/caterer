import React from "react";

const steps = [
  { emoji: "🔍", title: "Browse & Compare", desc: "Explore packages by event type, budget, or guest count and compare caterers side-by-side." },
  { emoji: "✏️", title: "Customise Menu", desc: "Select your dishes, add services, set guest count and event date to build your ideal package." },
  { emoji: "📋", title: "Request a Quote", desc: "Submit your requirements and receive a detailed itemised quote within 24 hours." },
  { emoji: "🎉", title: "Confirm & Celebrate", desc: "Accept the quote, pay a deposit, and let our caterers handle the rest on your big day." },
];

const HowItWorks = () => (
  <div className="py-16 bg-gray-50 border-y border-gray-100">
    <div className="max-w-screen-2xl mx-auto px-8 max-md:px-5">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
        <p className="text-gray-500 max-w-md mx-auto">From browse to banquet in four simple steps</p>
      </div>
      <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-y-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-3xl">{step.emoji}</div>
            <div className="w-7 h-7 bg-green-800 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</div>
            <h3 className="font-bold text-gray-900 text-base">{step.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HowItWorks;
