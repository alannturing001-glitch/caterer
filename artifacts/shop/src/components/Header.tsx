import { useLocation, Link } from "wouter";
import React from "react";
import HeaderTop from "./HeaderTop";
import SearchInput from "./SearchInput";
import CartElement from "./CartElement";
import NotificationBell from "./NotificationBell";
import HeartElement from "./HeartElement";
import { useWishlistStore } from "@/store/wishlistStore";

const Header = () => {
  const [location] = useLocation();
  const { wishQuantity } = useWishlistStore();
  return (
    <header className="bg-white">
      <HeaderTop />
      {!location.startsWith("/admin") && (
        <div className="h-32 bg-white flex items-center justify-between px-16 max-[1320px]:px-16 max-md:px-6 max-lg:flex-col max-lg:gap-y-7 max-lg:justify-center max-lg:h-60 max-w-screen-2xl mx-auto">
          <Link href="/" className="flex items-center gap-x-3 flex-shrink-0">
            <span className="text-4xl">🍽️</span>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-blue-700 leading-tight tracking-tight">CaterMarket</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Premium Catering</span>
            </div>
          </Link>
          <SearchInput />
          <div className="flex gap-x-6 items-center">
            <Link href="/packages" className="text-blue-700 font-bold hover:underline text-sm hidden lg:block">Browse Packages</Link>
            <NotificationBell />
            <HeartElement wishQuantity={wishQuantity} />
            <CartElement />
          </div>
        </div>
      )}
      {location.startsWith("/admin") && (
        <div className="flex justify-between h-20 bg-white items-center px-8 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-x-3">
            <span className="text-3xl">🍽️</span>
            <div>
              <span className="text-xl font-extrabold text-blue-700">CaterMarket</span>
              <span className="ml-2 text-xs text-gray-400 font-semibold">Admin</span>
            </div>
          </Link>
          <Link href="/" className="text-sm text-blue-600 hover:underline">← Back to site</Link>
        </div>
      )}
    </header>
  );
};
export default Header;
