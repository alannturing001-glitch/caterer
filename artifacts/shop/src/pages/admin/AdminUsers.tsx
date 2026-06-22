import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get("/api/users").then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-8 overflow-x-auto">
        <h1 className="text-3xl font-bold mb-8">Users</h1>
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-gray-100">{["ID","Email","Role","Registered"].map(h => <th key={h} className="p-3 text-left">{h}</th>)}</tr></thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>{u.role || "user"}</span></td>
                <td className="p-3">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};
export default AdminUsers
