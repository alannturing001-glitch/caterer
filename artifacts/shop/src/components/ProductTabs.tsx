import React, { useState } from "react";
import { sanitizeHtml, sanitize } from "@/lib/sanitize";
const ProductTabs = ({ product }: { product: any }) => {
  const [currentProductTab, setCurrentProductTab] = useState<number>(0);
  return (
    <div className="px-5 text-black">
      <div role="tablist" className="tabs tabs-bordered flex gap-x-4 border-b">
        {["Description", "Additional info"].map((tab, i) => (
          <a key={tab} role="tab" className={`tab text-lg text-black pb-4 cursor-pointer max-[500px]:text-base ${currentProductTab === i ? "border-b-2 border-blue-500" : ""}`} onClick={() => setCurrentProductTab(i)}>{tab}</a>
        ))}
      </div>
      <div className="pt-5">
        {currentProductTab === 0 && <div className="text-lg max-sm:text-sm" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product?.description) }} />}
        {currentProductTab === 1 && (
          <div className="overflow-x-auto">
            <table className="table text-xl text-center max-[500px]:text-base w-full">
              <tbody>
                <tr><th className="text-left">Manufacturer:</th><td>{sanitize(product?.manufacturer)}</td></tr>
                <tr><th className="text-left">Category:</th><td>{sanitize(product?.category)}</td></tr>
                <tr><th className="text-left">In Stock:</th><td>{product?.inStock ? "Yes" : "No"}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductTabs
