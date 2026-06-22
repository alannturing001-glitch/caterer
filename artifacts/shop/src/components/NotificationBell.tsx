import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { FaBell } from 'react-icons/fa6';
import { useAuth } from '@/hooks/useAuth';

const NotificationBell = () => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  if (!user) return null;
  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
        <FaBell className="w-6 h-6" />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-4 border-b"><h3 className="text-lg font-semibold text-gray-900">Notifications</h3></div>
          <div className="p-4 border-b">
            <Link href="/notifications" onClick={() => setIsDropdownOpen(false)} className="block w-full px-3 py-2 text-sm font-medium text-center text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100">View All</Link>
          </div>
          <div className="p-6 text-center"><FaBell className="w-12 h-12 mx-auto text-gray-300 mb-3" /><p className="text-gray-500 text-sm">No new notifications</p></div>
        </div>
      )}
    </div>
  );
};
export default NotificationBell
