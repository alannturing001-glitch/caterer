import { useProductStore } from "@/store/cartStore";
import React from "react";
import toast from "react-hot-toast";
import { useLocation } from "wouter";
const BuyNowSingleProductBtn = ({ product, quantityCount }: { product: any; quantityCount: number }) => {
  const [, navigate] = useLocation();
  const { addToCart, calculateTotals } = useProductStore();
  const handleAddToCart = () => {
    addToCart({ id: product?.id?.toString(), title: product?.title, price: product?.price, image: product?.mainImage, amount: quantityCount });
    calculateTotals();
    toast.success("Product added to the cart");
    navigate("/checkout");
  };
  return (
    <button onClick={handleAddToCart} className="btn w-[200px] text-lg border border-blue-500 font-normal bg-blue-500 text-white hover:bg-white hover:scale-110 hover:text-blue-500 transition-all uppercase ease-in max-[500px]:w-full px-4 py-2">Buy Now</button>
  );
};
export default BuyNowSingleProductBtn
