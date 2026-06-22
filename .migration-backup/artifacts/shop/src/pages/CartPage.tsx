import React from "react";
import { Link } from "wouter";

const CartPage = () => (
  <main className="flex flex-col items-center justify-center min-h-[60vh] gap-y-6 px-8">
    <span className="text-7xl">🛒</span>
    <h1 className="text-4xl font-bold text-gray-900">No Shopping Cart Here!</h1>
    <p className="text-gray-500 text-lg text-center max-w-md">
      Catering is personal — browse packages and request a custom quote directly from any package page. We'll craft a proposal just for your event.
    </p>
    <Link href="/packages" className="bg-yellow-400 text-blue-900 font-bold px-10 py-4 rounded-xl text-base hover:bg-yellow-300 transition-colors">
      Browse Packages
    </Link>
  </main>
);
export default CartPage;
