import React from "react";
import DashboardSidebar from "@/components/DashboardSidebar";

const AdminMerchant = () => {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Merchant Settings</h1>
        <p className="text-gray-500">Store configuration and merchant settings will appear here.</p>
        <div className="mt-8 grid grid-cols-1 gap-y-6 max-w-lg">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-2">Store Name</h2>
            <p className="text-gray-400 text-sm">Singitronic Electronics</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-2">Contact</h2>
            <p className="text-gray-400 text-sm">test@email.com · +381 61 123 321</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMerchant;
