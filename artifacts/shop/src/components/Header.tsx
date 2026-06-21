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
          <Link href="/">
            <img src="/logo v1 svg.svg" width={300} height={300} alt="singitronic logo" className="relative right-5 max-[1023px]:w-56" />
          </Link>
          <SearchInput />
          <div className="flex gap-x-10 items-center">
            <NotificationBell />
            <HeartElement wishQuantity={wishQuantity} />
            <CartElement />
          </div>
        </div>
      )}
      {location.startsWith("/admin") && (
        <div className="flex justify-between h-32 bg-white items-center px-16 max-[1320px]:px-10 max-w-screen-2xl mx-auto max-[400px]:px-5">
          <Link href="/">
            <img src="/logo v1.png" width={130} height={130} alt="Singitronic logo" />
          </Link>
        </div>
      )}
    </header>
  );
};
export default Header
