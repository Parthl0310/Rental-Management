import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { getWishlistAPI, toggleWishlistAPI } from "../../Api/Wishlist.api";
import { Heart, ShoppingBag, Eye, Star, Package, Loader2, HeartCrack } from "lucide-react";
import toast from "react-hot-toast";

export default function Wishlist() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const res = await getWishlistAPI();
      if (res && res.success) {
        setProducts(res.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load wishlist items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (e, productId) => {
    e.stopPropagation();
    try {
      // Remove locally first
      setProducts(prev => prev.filter(p => p._id !== productId));
      const res = await toggleWishlistAPI(productId);
      if (res && res.success) {
        toast.success("Removed from wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item from wishlist");
      fetchWishlist(); // Re-fetch on error
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Wishlist
            </h1>
            <p className="text-slate-500 mt-2">
              Keep track of items you want to rent.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-sky-500" size={40} />
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartCrack size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Your Wishlist is Empty
              </h2>
              <p className="text-slate-500 mb-6">
                Explore our catalog and click the heart icon on any product to save it here for later.
              </p>
              <Link
                to="/customer/products"
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-xl shadow transition"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((product) => {
                const {
                  _id,
                  name,
                  category,
                  images,
                  pricing,
                  availableStock,
                  averageRating,
                } = product;

                // Find lowest price
                const pricingOptions = [
                  { value: pricing?.perHour, label: "hr" },
                  { value: pricing?.perDay, label: "day" },
                  { value: pricing?.perWeek, label: "week" },
                  { value: pricing?.perMonth, label: "month" },
                ].filter((item) => item.value > 0);

                const lowestPrice =
                  pricingOptions.length > 0
                    ? pricingOptions.reduce((min, current) =>
                        current.value < min.value ? current : min
                      )
                    : null;

                return (
                  <div
                    key={_id}
                    onClick={() => navigate(`/customer/products/${_id}`)}
                    className="group bg-white rounded-3xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                  >
                    {/* Image Section */}
                    <div className="relative bg-slate-50 p-4 sm:p-5">
                      {/* Availability Badge */}
                      <div
                        className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 ${
                          availableStock > 0
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            availableStock > 0 ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {availableStock > 0 ? "Available" : "Out of Stock"}
                      </div>

                      {/* Wishlist Heart - Active */}
                      <button
                        onClick={(e) => handleRemoveFromWishlist(e, _id)}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-slate-100"
                      >
                        <Heart size={18} className="fill-rose-500 text-rose-500" />
                      </button>

                      {/* Product Image */}
                      <div className="h-48 sm:h-56 md:h-60 flex items-center justify-center">
                        {images && images.length > 0 ? (
                          <img
                            src={images[0]}
                            alt={name}
                            className="max-h-full object-contain transition-all duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                            <ShoppingBag size={48} />
                            <span className="text-sm mt-2">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Name */}
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 line-clamp-2">
                          {name}
                        </h3>

                        {/* Category Tag */}
                        <div className="mt-3">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                            {category}
                          </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-4">
                          <Star size={18} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{averageRating || 0}</span>
                          <span className="text-slate-400 text-sm">Rating</span>
                        </div>

                        {/* Price */}
                        <div className="mt-4">
                          <p className="text-slate-500 text-sm">From</p>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold text-slate-900">
                              ₹{lowestPrice?.value || 0}
                            </span>
                            <span className="text-slate-500 mb-1">
                              /{lowestPrice?.label || "day"}
                            </span>
                          </div>
                        </div>

                        {/* Available Stock */}
                        <div className="flex items-center gap-2 mt-4">
                          <Package
                            size={18}
                            className={availableStock > 0 ? "text-green-600" : "text-red-600"}
                          />
                          <span
                            className={`font-medium text-sm ${
                              availableStock > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {availableStock > 0 ? `${availableStock} Available` : "Out of Stock"}
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart Button (Navigates to detail page) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/customer/products/${_id}`);
                        }}
                        className="w-full mt-5 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300"
                      >
                        <ShoppingBag size={18} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
