import { useProductStore } from "@/store/cartStore";
import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
const QuantityInputCart = ({ product }: { product: any }) => {
  const [quantityCount, setQuantityCount] = useState<number>(product.amount);
  const { updateCartAmount, calculateTotals } = useProductStore();
  const handleQuantityChange = (action: string) => {
    if (action === "plus") { setQuantityCount(q => q + 1); updateCartAmount(product.id, quantityCount + 1); calculateTotals(); }
    else if (action === "minus" && quantityCount !== 1) { setQuantityCount(q => q - 1); updateCartAmount(product.id, quantityCount - 1); calculateTotals(); }
  };
  return (
    <div className="flex items-center rounded border border-gray-200 w-32">
      <button type="button" className="size-10 text-gray-600 hover:opacity-75 flex items-center justify-center" onClick={() => handleQuantityChange("minus")}><FaMinus /></button>
      <input type="number" disabled value={quantityCount} className="h-10 w-16 border-transparent text-center text-sm" />
      <button type="button" className="size-10 text-gray-600 hover:opacity-75 flex items-center justify-center" onClick={() => handleQuantityChange("plus")}><FaPlus /></button>
    </div>
  );
};
export default QuantityInputCart
