import React, { useEffect, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import { sanitize, sanitizeHtml } from "@/lib/sanitize";
import StockAvailabillity from "@/components/StockAvailabillity";
import UrgencyText from "@/components/UrgencyText";
import SingleProductDynamicFields from "@/components/SingleProductDynamicFields";
import ProductTabs from "@/components/ProductTabs";
import apiClient from "@/lib/api";
import { Loader } from "@/components/Loader";

const ProductPage = ({ params }: { params: { slug: string } }) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    apiClient.get(`/api/products/slug/${params.slug}`)
      .then(r => r.json())
      .then(d => { setProduct(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div className="flex justify-center items-center h-[500px]"><Loader /></div>;
  if (!product) return <div className="text-center py-20 text-2xl">Product not found</div>;

  return (
    <main>
      <SectionTitle title="PRODUCT" path={`Home / Product / ${sanitize(product.title)}`} />
      <div className="max-w-screen-2xl mx-auto py-10 px-8 max-sm:px-5">
        <div className="flex gap-x-16 max-lg:flex-col gap-y-10">
          <div className="flex-shrink-0 flex justify-center">
            <img src={product.mainImage ? `/${product.mainImage}` : "/product_placeholder.jpg"} alt={sanitize(product.title)} className="h-[400px] w-auto object-contain max-md:h-[300px]" />
          </div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-4xl font-bold max-[500px]:text-2xl max-[500px]:text-center">{sanitize(product.title)}</h1>
            <p className="text-3xl font-bold text-blue-500 max-[500px]:text-center">${product.price}</p>
            <StockAvailabillity stock={product.stock || 0} inStock={product.inStock} />
            {product.inStock === 1 && product.stock > 0 && product.stock < 10 && <UrgencyText stock={product.stock} />}
            <SingleProductDynamicFields product={product} />
          </div>
        </div>
        <div className="mt-16">
          <ProductTabs product={product} />
        </div>
      </div>
    </main>
  );
};
export default ProductPage
