import React, { useEffect, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import { sanitize, sanitizeHtml } from "@/lib/sanitize";
import ProductTabs from "@/components/ProductTabs";
import apiClient from "@/lib/api";
import { Loader } from "@/components/Loader";
import { useLocation } from "wouter";
import toast from "react-hot-toast";

const ProductPage = ({ params }: { params: { slug: string } }) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  const [guestCount, setGuestCount] = useState(50);
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient.get(`/api/products/slug/${params.slug}`)
      .then(r => r.json())
      .then(d => { setProduct(d); if (d.minGuests) setGuestCount(d.minGuests); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.slug]);

  const estimatedTotal = product
    ? (product.pricePerPerson ? product.pricePerPerson * guestCount : product.price)
    : 0;

  const handleQuoteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate) { toast.error("Please select an event date"); return; }
    if (!eventLocation) { toast.error("Please enter your event location"); return; }
    setSubmitting(true);
    try {
      const res = await apiClient.post("/api/orders", {
        name: "",
        email: "",
        phone: "",
        eventDate,
        eventLocation,
        guestCount,
        message,
        total: estimatedTotal,
        status: "pending",
        products: [{ id: product.id, title: product.title, slug: product.slug }],
      });
      if (res.ok) {
        toast.success("Quotation request submitted! We'll get back to you within 24 hours.");
        navigate("/");
      } else {
        toast.error("Failed to submit quotation. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[500px]"><Loader /></div>;
  if (!product) return <div className="text-center py-20 text-2xl">Package not found</div>;

  return (
    <main>
      <SectionTitle title="PACKAGE DETAILS" path={`Home / Packages / ${sanitize(product.title)}`} />
      <div className="max-w-screen-2xl mx-auto py-10 px-8 max-sm:px-5">
        <div className="flex gap-x-16 max-lg:flex-col gap-y-10">
          {/* Left: Package Image & Info */}
          <div className="flex-1">
            <div className="rounded-2xl overflow-hidden mb-6">
              <img
                src={product.mainImage ? `/${product.mainImage}` : "/product_placeholder.jpg"}
                alt={sanitize(product.title)}
                className="w-full h-[380px] object-cover"
              />
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-x-3 mb-2">
                {product.category && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{product.category}</span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 max-[500px]:text-2xl">{sanitize(product.title)}</h1>
              <div className="flex items-center gap-x-6 mb-4">
                {product.pricePerPerson ? (
                  <p className="text-3xl font-bold text-blue-600">
                    From <span className="text-yellow-500">${product.pricePerPerson}</span>/person
                  </p>
                ) : (
                  <p className="text-3xl font-bold text-blue-600">${product.price}</p>
                )}
                {product.minGuests && (
                  <span className="text-gray-500 text-sm">👥 {product.minGuests}–{product.maxGuests || 500} guests</span>
                )}
                {product.duration && (
                  <span className="text-gray-500 text-sm">⏱ {product.duration}</span>
                )}
              </div>
              {product.description && (
                <div
                  className="text-gray-600 leading-relaxed text-base"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                />
              )}
            </div>
            <div className="mt-10">
              <ProductTabs product={product} />
            </div>
          </div>

          {/* Right: Quotation Builder */}
          <div className="w-[420px] max-lg:w-full flex-shrink-0">
            <div className="sticky top-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Request a Quote</h2>
              <p className="text-gray-500 text-sm mb-6">Fill in your event details and we'll send you a detailed quote.</p>

              <form onSubmit={handleQuoteRequest} className="flex flex-col gap-y-4">
                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Guest Count: <span className="text-blue-600">{guestCount}</span>
                  </label>
                  <input
                    type="range"
                    min={product.minGuests || 10}
                    max={product.maxGuests || 500}
                    value={guestCount}
                    onChange={e => setGuestCount(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{product.minGuests || 10} guests</span>
                    <span>{product.maxGuests || 500} guests</span>
                  </div>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Event Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Location *</label>
                  <input
                    type="text"
                    placeholder="Venue name or address"
                    value={eventLocation}
                    onChange={e => setEventLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    placeholder="Dietary requirements, special requests, theme..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  />
                </div>

                {/* Live Price Estimate */}
                {product.pricePerPerson && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Base price per person</span>
                      <span>${product.pricePerPerson}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                      <span>Number of guests</span>
                      <span>× {guestCount}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-blue-200 pt-3">
                      <span className="text-gray-900">Estimated Total</span>
                      <span className="text-blue-600">${estimatedTotal.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">* Final price may vary based on menu selections and services</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-yellow-400 text-blue-900 font-bold py-4 rounded-xl text-base hover:bg-yellow-300 transition-colors disabled:opacity-50 mt-2"
                >
                  {submitting ? "Submitting..." : "📋 Submit Quotation Request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default ProductPage;
