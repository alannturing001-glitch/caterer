import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
const RegisterPage = () => {
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [confirm, setConfirm] = useState("");
  const { register } = useAuth();
  const [, navigate] = useLocation();
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    const result = await register(email, password);
    if (result.ok) { toast.success("Registration successful! Please login."); navigate("/login"); }
    else toast.error(result.error || "Registration failed");
  };
  return (
    <main>
      <div className="h-[250px] border-b pt-16 border-white bg-blue-500 mb-2 max-sm:h-[200px]">
        <h1 className="text-7xl text-center mb-7 text-white max-sm:text-5xl">REGISTER</h1>
        <p className="text-xl text-center text-white">Home / Register</p>
      </div>
      <div className="flex justify-center items-center py-20">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold text-center">Create Account</h2>
          <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Confirm Password</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <button type="submit" className="uppercase bg-white px-4 py-3 text-base border border-black font-bold text-blue-600 shadow-sm hover:bg-gray-100 focus:outline-none">Register</button>
          <p className="text-center text-sm">Already have an account? <a href="/login" className="text-blue-600 font-semibold">Login</a></p>
        </form>
      </div>
    </main>
  );
};
export default RegisterPage
