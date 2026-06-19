import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  AlertCircle,
  Loader2,
} from "lucide-react";

import toast from "react-hot-toast";

import Navbar from "../../components/common/Navbar";
import ImageGallery from "../../components/product/ImageGallery";
import AvailabilityCalendar from "../../components/product/AvailabilityCalendar";
import PriceCalculator from "../../components/product/PriceCalculator";

import {
  getSingleProductAPI,
} from "../../api/product.api";

export default function ProductDetail() {
  const { productId } = useParams();

  const [product, setProduct] =
    useState(null);

  const [selectedDates, setSelectedDates] =
    useState({
      startDate: null,
      endDate: null,
    });

  const [quantity, setQuantity] =
    useState(1);

  const [couponCode, setCouponCode] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);

      const res =
        await getSingleProductAPI(
          productId
        );

      setProduct(res.data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load product"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityDecrease =
    () => {
      if (quantity > 1) {
        setQuantity(
          quantity - 1
        );
      }
    };

  const handleQuantityIncrease =
    () => {
      if (
        quantity <
        product.availableStock
      ) {
        setQuantity(
          quantity + 1
        );
      }
    };

  const handleAddToCart = () => {
    if (
      !selectedDates.startDate ||
      !selectedDates.endDate
    ) {
      toast.error(
        "Please select rental dates"
      );

      return;
    }

    toast.success(
      "Added to cart (coming soon)"
    );
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url:
            window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        toast.success(
          "Link copied to clipboard"
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <Loader2
            className="animate-spin text-sky-500"
            size={40}
          />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <h2 className="text-xl font-semibold">
            Product Not Found
          </h2>
        </div>
      </>
    );
  }
    return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-6">

          {/* Breadcrumb */}

          <div className="mb-6">
            <Link
              to="/customer/products"
              className="text-sky-600 hover:text-sky-700"
            >
              All Products
            </Link>

            <span className="mx-2 text-slate-400">
              /
            </span>

            <span className="text-slate-700">
              {product.name}
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">

            {/* LEFT SIDE */}

            <div>

              <ImageGallery
                images={product.images || []}
              />

              <button
                className="mt-5 w-full h-12 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Heart size={18} />
                Add To Wishlist
              </button>

            </div>

            {/* RIGHT SIDE */}

            <div className="space-y-6">

              {/* Product Info */}

              <div className="bg-white rounded-3xl border border-slate-200 p-6">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h1 className="text-3xl font-bold text-slate-900">
                      {product.name}
                    </h1>

                    <p className="mt-2 text-slate-500">
                      {product.category}
                    </p>

                  </div>

                  {product.availableStock === 0 && (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                      Out Of Stock
                    </span>
                  )}

                </div>

                <p className="mt-4 text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm">
                  <AlertCircle
                    size={16}
                    className="text-sky-500"
                  />

                  <span>
                    Available Stock:
                    {" "}
                    {product.availableStock}
                  </span>

                </div>

              </div>

              {/* Price Calculator */}

              <PriceCalculator
                productId={productId}
                selectedDates={selectedDates}
                quantity={quantity}
              />

              {/* Availability Calendar */}

              <AvailabilityCalendar
                productId={productId}
                onDateSelect={setSelectedDates}
              />

              {/* Quantity Selector */}

              <div className="bg-white rounded-3xl border border-slate-200 p-6">

                <h3 className="font-semibold text-lg mb-4">
                  Quantity
                </h3>

                <div className="flex items-center gap-4">

                  <button
                    onClick={
                      handleQuantityDecrease
                    }
                    disabled={quantity <= 1}
                    className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center disabled:opacity-50"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="text-xl font-semibold min-w-[40px] text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={
                      handleQuantityIncrease
                    }
                    disabled={
                      quantity >=
                      product.availableStock
                    }
                    className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>

                </div>

              </div>

              {/* Coupon */}

              <div className="bg-white rounded-3xl border border-slate-200 p-6">

                <h3 className="font-semibold text-lg mb-4">
                  Apply Coupon
                </h3>

                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) =>
                    setCouponCode(
                      e.target.value
                    )
                  }
                  placeholder="Enter coupon code"
                  className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-sky-500"
                />

              </div>

              {/* Actions */}

              <div className="grid sm:grid-cols-2 gap-4">

                <button
                  onClick={handleAddToCart}
                  disabled={
                    product.availableStock === 0 ||
                    !selectedDates.startDate ||
                    !selectedDates.endDate
                  }
                  className="h-12 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Add To Cart
                </button>

                <button
                  onClick={handleShare}
                  className="h-12 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <Share2 size={18} />
                  Share
                </button>

              </div>

              {/* Terms */}

              <div className="bg-white rounded-3xl border border-slate-200 p-6">

                <h3 className="font-semibold text-lg mb-3">
                  Terms & Conditions
                </h3>

                <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                  <li>
                    Product must be returned in the same condition.
                  </li>

                  <li>
                    Late returns may incur additional charges.
                  </li>

                  <li>
                    Deposit amount may be adjusted for damages.
                  </li>

                  <li>
                    Valid ID proof may be required during pickup.
                  </li>
                </ul>

              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );  
}