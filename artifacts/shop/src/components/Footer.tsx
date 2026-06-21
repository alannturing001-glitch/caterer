import { navigation } from "@/lib/utils";
import React from "react";
const Footer = () => (
  <footer className="bg-gray-900" aria-labelledby="footer-heading">
    <div>
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-8 pt-24 pb-14">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div>
            <div className="flex items-center gap-x-3 mb-3">
              <span className="text-4xl">🍽️</span>
              <span className="text-2xl font-bold text-white">CaterMarket</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Premium catering packages for every occasion. From intimate gatherings to grand celebrations.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-bold leading-6 text-yellow-400 uppercase tracking-wider">Packages</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.packages.map((item) => <li key={item.name}><a href={item.href} className="text-sm leading-6 text-gray-400 hover:text-white transition-colors">{item.name}</a></li>)}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-bold leading-6 text-yellow-400 uppercase tracking-wider">About Us</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.about.map((item) => <li key={item.name}><a href={item.href} className="text-sm leading-6 text-gray-400 hover:text-white transition-colors">{item.name}</a></li>)}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-bold leading-6 text-yellow-400 uppercase tracking-wider">Customers</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.customers.map((item) => <li key={item.name}><a href={item.href} className="text-sm leading-6 text-gray-400 hover:text-white transition-colors">{item.name}</a></li>)}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-bold leading-6 text-yellow-400 uppercase tracking-wider">Help</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.help.map((item) => <li key={item.name}><a href={item.href} className="text-sm leading-6 text-gray-400 hover:text-white transition-colors">{item.name}</a></li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-800 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500">&copy; 2024 CaterMarket. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;
