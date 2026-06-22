import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
const LoginPage = () => {
  const [email, setEmail] = useState(""), [password, setPassword] = useState("");
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.ok) { toast.success("Login successful!"); navigate("/"); }
    else toast.error(result.error || "Login failed");
  };
  return (
    <main>
      <div className="h-[250px] border-b pt-16 border-white bg-blue-500 mb-2 max-sm:h-[200px]">
        <h1 className="text-7xl text-center mb-7 text-white max-sm:text-5xl">LOGIN</h1>
        <p className="text-xl text-center text-white">Home / Login</p>
      </div>
      <div className="flex justify-center items-center py-20">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold text-center">Sign In</h2>
          <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <button type="submit" className="uppercase bg-white px-4 py-3 text-base border border-black font-bold text-blue-600 shadow-sm hover:bg-gray-100 focus:outline-none">Login</button>
          <p className="text-center text-sm">Don't have an account? <a href="/register" className="text-blue-600 font-semibold">Register</a></p>
        </form>
      </div>
    </main>
  );
};
export default LoginPage
