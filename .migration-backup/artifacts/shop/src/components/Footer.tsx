import React from "react";
import { Link } from "wouter";

const Footer = () => (
  <footer className="bg-green-950 text-green-300">
    <div className="max-w-screen-2xl mx-auto px-8 pt-16 pb-8 max-md:px-5">
      <div className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <div>
          <div className="flex items-center gap-x-2 mb-4">
            <span className="text-2xl">🍽️</span>
            <span className="text-white font-bold text-lg">CaterMarket</span>
          </div>
          <p className="text-sm leading-relaxed text-green-400">Premium catering packages for every occasion — from intimate gatherings to grand celebrations.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Packages</h4>
          <ul className="space-y-2 text-sm">
            {["Browse All Packages", "Wedding Packages", "Corporate Packages", "Birthday Packages"].map(l => (
              <li key={l}><Link href="/packages" className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {["About Us", "Become a Caterer", "Work With Us", "Blog"].map(l => (
              <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            {["How It Works", "FAQ", "Contact Us", "Privacy Policy"].map(l => (
              <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-green-800/50 mt-12 pt-8 flex justify-between items-center max-sm:flex-col max-sm:gap-y-2 text-xs text-green-500">
        <span>© 2024 CaterMarket. All rights reserved.</span>
        <span>📞 +1 (800) CATERING &nbsp;·&nbsp; ✉️ hello@catermarket.com</span>
      </div>
    </div>
  </footer>
);

export default Footer;
