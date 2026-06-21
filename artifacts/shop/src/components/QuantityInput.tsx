import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
const QuantityInput = ({ quantityCount, setQuantityCount }: { quantityCount: number; setQuantityCount: (n: number) => void }) => (
  <div className="flex items-center rounded border border-gray-200 w-32">
    <button type="button" className="size-10 leading-10 text-gray-600 transition hover:opacity-75 flex items-center justify-center" onClick={() => quantityCount > 1 && setQuantityCount(quantityCount - 1)}><FaMinus /></button>
    <input type="number" disabled value={quantityCount} className="h-10 w-16 border-transparent text-center text-sm" />
    <button type="button" className="size-10 leading-10 text-gray-600 transition hover:opacity-75 flex items-center justify-center" onClick={() => setQuantityCount(quantityCount + 1)}><FaPlus /></button>
  </div>
);
export default QuantityInput
