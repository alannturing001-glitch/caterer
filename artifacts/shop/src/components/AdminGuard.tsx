import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loaded } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loaded) return;
    if (user === null) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, loaded]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;
