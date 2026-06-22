import { useLocation, Link } from "wouter";
import React from "react";
import SearchInput from "./SearchInput";
import NotificationBell from "./NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { FaBell, FaUser, FaChevronDown } from "react-icons/fa6";

const Header = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const handleLogout = () => { logout(); toast.success("Logged out!"); };

  const isAdmin = location.startsWith("/admin");

  return (
    <header className="bg-green-900 shadow-lg">
      {/* Top Bar */}
      <div className="border-b border-green-800/50">
        <div className="max-w-screen-2xl mx-auto px-8 max-md:px-4 h-9 flex items-center justify-between text-xs text-green-300">
          <span>📞 +1 (800) CATERING &nbsp;·&nbsp; ✉️ hello@catermarket.com</span>
          <div className="flex items-center gap-x-4">
            {!user ? (
              <>
                <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
                <Link href="/register" className="hover:text-white transition-colors">Register</Link>
              </>
            ) : (
              <>
                <span className="text-green-400">{user.email}</span>
                <button onClick={handleLogout} className="hover:text-white transition-colors">Sign Out</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-screen-2xl mx-auto px-8 max-md:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-x-2.5 flex-shrink-0">
            <span className="text-2xl">🍽️</span>
            <div>
              <span className="text-white font-extrabold text-xl tracking-tight">CaterMarket</span>
              {!isAdmin && <div className="text-green-400 text-[10px] font-medium uppercase tracking-widest leading-none">Premium Catering</div>}
            </div>
          </Link>

          {/* Desktop Nav */}
          {!isAdmin && (
            <nav className="hidden lg:flex items-center gap-x-6">
              <Link href="/" className={`text-sm font-medium transition-colors ${location === "/" ? "text-amber-400" : "text-green-200 hover:text-white"}`}>
                Home
              </Link>
              <Link href="/packages" className={`text-sm font-medium transition-colors ${location.startsWith("/packages") ? "text-amber-400" : "text-green-200 hover:text-white"}`}>
                Browse
              </Link>
              <Link href="/my-quotations" className={`text-sm font-medium transition-colors ${location === "/my-quotations" ? "text-amber-400" : "text-green-200 hover:text-white"}`}>
                Quotations
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                  Admin
                </Link>
              )}
            </nav>
          )}

          {!isAdmin && (
            <div className="flex items-center gap-x-3">
              <div className="w-52 max-md:hidden">
                <SearchInput />
              </div>
              <NotificationBell />
              {!user ? (
                <Link href="/login" className="hidden md:flex items-center gap-x-1.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                  <FaUser className="text-xs" /> Sign In
                </Link>
              ) : (
                <div className="flex items-center gap-x-2 text-green-200 text-sm">
                  <FaUser className="text-green-400" />
                  <span className="hidden md:inline truncate max-w-[120px]">{user.email?.split("@")[0]}</span>
                </div>
              )}
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center gap-x-4">
              <Link href="/" className="text-green-300 hover:text-white text-sm transition-colors">← Back to site</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
