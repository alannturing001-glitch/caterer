import React, { useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import { useWishlistStore } from "@/store/wishlistStore";
import { Link } from "wouter";
import { sanitize } from "@/lib/sanitize";
import toast from "react-hot-toast";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlistStore();
  return (
    <main>
      <SectionTitle title="WISHLIST" path="Home / Wishlist" />
      <div className="max-w-screen-2xl mx-auto px-8 pb-20 mt-10">
        {wishlist.length === 0 ? (
          <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl">No items found in the wishlist</h3>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead><tr>{["","Image","Name","Stock","Action"].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
              <tbody>
                {wishlist.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3"><button onClick={() => { removeFromWishlist(item.id); toast.success("Removed from wishlist"); }} className="text-gray-400 hover:text-red-500 text-xl">×</button></td>
                    <td className="p-3"><img src={item.image ? `/${item.image}` : "/product_placeholder.jpg"} alt={sanitize(item.title)} className="w-20 h-20 object-cover mx-auto" /></td>
                    <td className="p-3"><Link href={`/product/${item.slug}`} className="text-blue-600 hover:underline">{sanitize(item.title)}</Link></td>
                    <td className="p-3">{item.stockAvailabillity ? <span className="text-green-500">In Stock</span> : <span className="text-red-500">Out of Stock</span>}</td>
                    <td className="p-3"><Link href={`/product/${item.slug}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">View Product</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};
export default WishlistPage
