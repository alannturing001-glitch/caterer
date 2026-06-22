import React from "react";
import SectionTitle from "@/components/SectionTitle";
import { FaBell } from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
const NotificationsPage = () => {
  const { user } = useAuth();
  return (
    <main>
      <SectionTitle title="NOTIFICATIONS" path="Home / Notifications" />
      <div className="max-w-screen-2xl mx-auto px-8 pb-20 mt-10">
        {!user ? (
          <div className="text-center py-20"><p className="text-xl">Please <a href="/login" className="text-blue-600 font-bold">login</a> to view notifications.</p></div>
        ) : (
          <div className="flex flex-col items-center py-20 gap-y-4">
            <FaBell className="w-16 h-16 text-gray-300" />
            <p className="text-xl text-gray-500">No notifications at this time.</p>
          </div>
        )}
      </div>
    </main>
  );
};
export default NotificationsPage
