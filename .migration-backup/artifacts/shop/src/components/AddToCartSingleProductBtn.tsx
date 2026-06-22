import React from "react";
import { useProductStore } from "@/store/cartStore";
import toast from "react-hot-toast";
const AddToCartSingleProductBtn = ({ product, quantityCount }: { product: any; quantityCount: number }) => {
  const { addToCart, calculateTotals } = useProductStore();
  const handleAddToCart = () => {
    addToCart({ id: product?.id?.toString(), title: product?.title, price: product?.price, image: product?.mainImage, amount: quantityCount });
    calculateTotals();
    toast.success("Product added to the cart");
  };
  return (
    <button onClick={handleAddToCart} className="btn w-[200px] text-lg border border-gray-300 font-normal bg-white text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:scale-110 transition-all uppercase ease-in max-[500px]:w-full px-4 py-2">Add to cart</button>
  );
};
export default AddToCartSingleProductBtn
