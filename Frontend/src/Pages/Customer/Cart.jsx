import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import Navbar from "../../components/common/Navbar";
import { toggleWishlistAPI, getWishlistAPI } from "../../Api/Wishlist.api";
import { applyCouponAPI, removeCouponAPI } from "../../Api/Cart.api";
import {
  Heart,
  Trash2,
  Minus,
  Plus,
  ChevronRight,
  ShoppingBag,
  Ticket,
  Info,
  ArrowRight,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, setCart, removeItem, updateItem, fetchCart, isLoading } = useCart();
  const navigate = useNavigate();

  const [couponText, setCouponText] = useState("");
  const [localQuantities, setLocalQuantities] = useState({});
  const [isCouponApplying, setIsCouponApplying] = useState(false);
  const timeoutsRef = useRef({});
  const [wishlistIds, setWishlistIds] = useState([]);

  // Sync backend quantities to local state
  useEffect(() => {
    if (cart?.items) {
      const q = {};
      cart.items.forEach((item) => {
        if (item.product) {
          q[item.product._id] = item.quantity;
        }
      });
      setLocalQuantities(q);
    }
  }, [cart]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, []);

  // Fetch wishlist items on mount to know which items are wishlisted
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await getWishlistAPI();
        if (res && res.success) {
          setWishlistIds(res.data.map((p) => p._id));
        }
      } catch (err) {
        console.error("Error fetching wishlist in cart:", err);
      }
    };
    fetchWishlist();
  }, []);

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format duration helper
  const formatDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalHours = Math.ceil((end - start) / (1000 * 60 * 60));
    if (totalHours <= 0) return "0 hours";

    if (totalHours >= 720) {
      const months = Math.floor(totalHours / 720);
      return `${months} month${months > 1 ? "s" : ""}`;
    } else if (totalHours >= 168) {
      const weeks = Math.floor(totalHours / 168);
      return `${weeks} week${weeks > 1 ? "s" : ""}`;
    } else if (totalHours >= 24) {
      const days = Math.floor(totalHours / 24);
      return `${days} day${days > 1 ? "s" : ""}`;
    } else {
      return `${totalHours} hour${totalHours > 1 ? "s" : ""}`;
    }
  };

  // Debounced API call to update quantity on server
  const debouncedUpdate = (productId, quantity) => {
    if (timeoutsRef.current[productId]) {
      clearTimeout(timeoutsRef.current[productId]);
    }

    timeoutsRef.current[productId] = setTimeout(async () => {
      try {
        await updateItem(productId, { newQuantity: quantity });
      } catch (err) {
        toast.error(
          err.response?.data?.message || err.message || "Failed to update quantity"
        );
        // Force refresh to restore last known database state
        fetchCart();
      }
    }, 500);
  };

  const handleQtyChange = (productId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    const item = cart.items.find((i) => i.product && i.product._id === productId);
    if (item && item.product.availableStock < newQty) {
      toast.error(`Only ${item.product.availableStock} items are available in stock`);
      return;
    }

    setLocalQuantities((prev) => ({
      ...prev,
      [productId]: newQty,
    }));

    debouncedUpdate(productId, newQty);
  };

  const handleMoveToWishlist = async (productId) => {
    try {
      const isAlreadyWishlisted = wishlistIds.includes(productId);
      if (!isAlreadyWishlisted) {
        await toggleWishlistAPI(productId);
        setWishlistIds((prev) => [...prev, productId]);
      }
      await removeItem(productId);
      toast.success(
        isAlreadyWishlisted
          ? "Item removed from cart (already in wishlist)"
          : "Item moved to wishlist"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to move to wishlist"
      );
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponText.trim()) return;
    try {
      setIsCouponApplying(true);
      const res = await applyCouponAPI({ couponCode: couponText });
      if (res.success) {
        setCart(res.data);
        toast.success("Coupon applied successfully!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to apply coupon"
      );
    } finally {
      setIsCouponApplying(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      setIsCouponApplying(true);
      const res = await removeCouponAPI();
      if (res.success) {
        setCart(res.data);
        setCouponText("");
        toast.success("Coupon removed successfully!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to remove coupon"
      );
    } finally {
      setIsCouponApplying(false);
    }
  };

  const handleProceed = () => {
    navigate("/customer/checkout/delivery");
  };

  // Calculations
  const subTotal =
    cart?.items?.reduce((acc, item) => acc + (item.subTotal || 0), 0) || 0;

  const taxTotal =
    cart?.items?.reduce((acc, item) => {
      const taxPercent = item.product?.taxPercent || 0;
      return acc + (item.subTotal || 0) * (taxPercent / 100);
    }, 0) || 0;

  const depositTotal =
    cart?.items?.reduce((acc, item) => {
      const depositAmount = item.product?.depositAmount || 0;
      return acc + depositAmount * (item.quantity || 1);
    }, 0) || 0;

  const deliveryCharge = cart?.deliveryCharge || 0;
  const couponDiscount = cart?.couponDiscount || 0;
  const grandTotal =
    subTotal + taxTotal + depositTotal + deliveryCharge - couponDiscount;

  if (isLoading && !cart) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="animate-spin text-sky-500" size={40} />
        </div>
      </>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <span className="font-semibold text-sky-600 bg-sky-50 border border-sky-200 px-4 py-2 rounded-xl text-sm whitespace-nowrap shadow-sm">
              1. Review Order
            </span>
            <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
            <span className="text-slate-400 font-medium text-sm whitespace-nowrap">
              2. Delivery
            </span>
            <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
            <span className="text-slate-400 font-medium text-sm whitespace-nowrap">
              3. Payment
            </span>
          </div>

          {isEmpty ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-lg mx-auto mt-12 shadow-sm">
              <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Your Cart is Empty
              </h2>
              <p className="text-slate-500 mb-6">
                Looks like you haven't added any rental equipment to your cart yet. Browse our shop to find the best items for your needs.
              </p>
              <Link
                to="/customer/products"
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-xl shadow transition"
              >
                Browse Products
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            /* Cart Grid */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Section - Items List */}
              <div className="lg:col-span-2 space-y-6">
                {cart.items.map((item) => {
                  if (!item.product) return null;
                  const qty = localQuantities[item.product._id] || item.quantity;
                  const durationLabel = formatDuration(
                    item.startDate,
                    item.endDate
                  );

                  return (
                    <div
                      key={item.product._id}
                      className="bg-white rounded-3xl border border-slate-200 p-5 flex flex-col sm:flex-row gap-5 hover:shadow-md transition duration-200"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-full sm:w-28 h-28 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100">
                        {item.product.images && item.product.images[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="text-slate-300" size={32} />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-lg text-slate-800">
                              {item.product.name}
                            </h3>
                            <span className="font-semibold text-slate-800 text-right">
                              ₹{item.subTotal}
                            </span>
                          </div>

                          <div className="mt-2 text-sm text-slate-500 space-y-1">
                            <p>
                              <span className="font-medium text-slate-700">Dates: </span>
                              {formatDate(item.startDate)} - {formatDate(item.endDate)}
                            </p>
                            <p>
                              <span className="font-medium text-slate-700">Duration: </span>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                {durationLabel}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Controls & Actions */}
                        <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQtyChange(item.product._id, qty, -1)}
                              disabled={qty <= 1}
                              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-50 hover:bg-slate-50 transition"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-semibold text-slate-700 min-w-[24px] text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleQtyChange(item.product._id, qty, 1)}
                              disabled={qty >= item.product.availableStock}
                              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-50 hover:bg-slate-50 transition"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Move to Wishlist & Delete */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleMoveToWishlist(item.product._id)}
                              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-rose-500 transition px-2.5 py-1.5 rounded-lg hover:bg-rose-50"
                              title={wishlistIds.includes(item.product._id) ? "Already in Wishlist" : "Move to Wishlist"}
                            >
                              <Heart
                                size={16}
                                className={wishlistIds.includes(item.product._id) ? "fill-rose-500 text-rose-500" : ""}
                              />
                              <span className="hidden sm:inline">
                                {wishlistIds.includes(item.product._id) ? "Wishlisted" : "Wishlist"}
                              </span>
                            </button>
                            <button
                              onClick={() => removeItem(item.product._id)}
                              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-500 transition px-2.5 py-1.5 rounded-lg hover:bg-red-50"
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Section - Summary Pane */}
              <div className="space-y-6">
                {/* Coupon Box */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                    <Ticket size={20} className="text-sky-500" />
                    Promo Coupon
                  </h4>
                  {cart.couponCode ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-emerald-800">
                      <div>
                        <p className="font-semibold text-sm">{cart.couponCode}</p>
                        <p className="text-xs text-emerald-600">Coupon applied successfully</p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        disabled={isCouponApplying}
                        className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponText}
                        onChange={(e) => setCouponText(e.target.value)}
                        className="flex-1 h-11 border border-slate-200 rounded-xl px-3 outline-none text-sm focus:border-sky-500 transition"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isCouponApplying || !couponText.trim()}
                        className="bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-medium px-4 rounded-xl text-sm transition flex items-center justify-center"
                      >
                        {isCouponApplying ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Summary Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-800 text-lg pb-2 border-b">
                    Order Summary
                  </h4>

                  <div className="space-y-3 text-sm">
                    {/* Item Subtotals breakdown */}
                    <div className="flex justify-between text-slate-600">
                      <span>Rental Base Rent</span>
                      <span>₹{subTotal}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Charge</span>
                      <span>—</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Taxes & GST</span>
                      <span>₹{taxTotal.toFixed(2)}</span>
                    </div>

                    {depositTotal > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Security Deposit (Refundable)</span>
                        <span>₹{depositTotal}</span>
                      </div>
                    )}

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Coupon Discount</span>
                        <span>- ₹{couponDiscount}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 flex justify-between items-baseline">
                    <span className="font-bold text-slate-800 text-base">Grand Total</span>
                    <span className="font-extrabold text-2xl text-slate-900">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 text-xs text-slate-400 flex gap-1.5 items-start">
                    <Info size={14} className="flex-shrink-0 mt-0.5" />
                    <span>Security deposits are refundable and returned upon complete return validation.</span>
                  </div>

                  <button
                    onClick={handleProceed}
                    className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-sky-100 hover:shadow-sky-200 transition mt-6"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cart Bottom Bar (Only when cart has items) */}
      {!isEmpty && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 py-3 px-4 flex items-center justify-between lg:hidden z-40 shadow-xl">
          <div>
            <p className="text-xs text-slate-400 font-medium">Grand Total</p>
            <p className="text-lg font-black text-slate-800">₹{grandTotal.toFixed(2)}</p>
          </div>
          <button
            onClick={handleProceed}
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm px-6 h-10 rounded-lg flex items-center gap-1.5 shadow"
          >
            Checkout
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}
