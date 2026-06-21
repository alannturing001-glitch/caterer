import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    } else if (user && !isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin]);

  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Checking authorization...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
