import { useProductStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import React from "react";
import { Link } from "wouter";
import { FaCheck, FaCircleQuestion, FaClock, FaXmark } from "react-icons/fa6";
import QuantityInputCart from "@/components/QuantityInputCart";
import { sanitize } from "@/lib/sanitize";

export const CartModule = () => {
  const { products, removeFromCart, calculateTotals, total } = useProductStore();
  const handleRemoveItem = (id: string) => { removeFromCart(id); calculateTotals(); toast.success("Product removed from the cart"); };
  return (
    <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
      <section aria-labelledby="cart-heading" className="lg:col-span-7">
        <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
        <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
          {products.map((product) => (
            <li key={product.id} className="flex py-6 sm:py-10">
              <div className="flex-shrink-0">
                <img width={192} height={192} src={product?.image ? `/${product.image}` : "/product_placeholder.jpg"} alt="product" className="h-24 w-24 rounded-md object-cover sm:h-48 sm:w-48" />
              </div>
              <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">{sanitize(product.title)}</h3>
                    <p className="mt-1 text-sm font-medium text-gray-900">${product.price}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:pr-9">
                    <QuantityInputCart product={product} />
                    <div className="absolute right-0 top-0">
                      <button onClick={() => handleRemoveItem(product.id)} type="button" className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500">
                        <FaXmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                  <FaCheck className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>In stock</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>
        <dl className="mt-6 space-y-4">
          <div className="flex items-center justify-between"><dt className="text-sm text-gray-600">Subtotal</dt><dd className="text-sm font-medium text-gray-900">${total}</dd></div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4"><dt className="text-sm text-gray-600">Shipping estimate</dt><dd className="text-sm font-medium text-gray-900">$5.00</dd></div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4"><dt className="text-base font-medium text-gray-900">Order total</dt><dd className="text-base font-medium text-gray-900">${total === 0 ? 0 : Math.round(total + total / 5 + 5)}</dd></div>
        </dl>
        {products.length > 0 && (
          <div className="mt-6">
            <Link href="/checkout" className="block flex justify-center items-center w-full uppercase bg-white px-4 py-3 text-base border border-black font-bold text-blue-600 shadow-sm hover:bg-gray-100 focus:outline-none">Checkout</Link>
          </div>
        )}
      </section>
    </form>
  );
};
