import React from "react";
import { FaArrowUp } from "react-icons/fa6";
const StatsElement = ({ title, value }: { title?: string; value?: string | number }) => (
  <div className="w-full h-32 bg-blue-500 text-white flex flex-col justify-center items-center rounded-md">
    <h4 className="text-xl text-white">{title || "New Products"}</h4>
    <p className="text-2xl font-bold">{value ?? "2,230"}</p>
    <p className="text-green-300 flex gap-x-1 items-center"><FaArrowUp />12.5% Since last month</p>
  </div>
);
export default StatsElement
