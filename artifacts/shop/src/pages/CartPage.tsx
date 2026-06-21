import React from "react";
import SectionTitle from "@/components/SectionTitle";
import { CartModule } from "@/components/modules/cart";
const CartPage = () => (
  <main>
    <SectionTitle title="CART" path="Home / Cart" />
    <div className="max-w-screen-2xl mx-auto px-8 pb-20 max-sm:px-5">
      <CartModule />
    </div>
  </main>
);
export default CartPage
