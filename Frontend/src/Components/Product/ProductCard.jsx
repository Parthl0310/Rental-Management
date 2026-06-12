import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, Package, Star, Camera } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const {
    _id,
    name,
    category,
    images,
    pricing,
    availableStock,
    averageRating,
  } = product;

  const pricingOptions = [
    {
      value: pricing?.perHour,
      label: "hr",
    },
    {
      value: pricing?.perDay,
      label: "day",
    },
    {
      value: pricing?.perWeek,
      label: "week",
    },
    {
      value: pricing?.perMonth,
      label: "month",
    },
  ].filter((item) => item.value > 0);

  const lowestPrice =
    pricingOptions.length > 0
      ? pricingOptions.reduce((min, current) =>
          current.value < min.value ? current : min
        )
      : null;

  useEffect(() => {
    if (!isHovered || !images?.length || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 700);

    return () => clearInterval(interval);
  }, [isHovered, images]);

  const handleNavigate = () => {
    navigate(`/customer/products/${_id}`);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/customer/products/${_id}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    // TODO:
    // Add wishlist functionality
  };

  return (
    <div
      onClick={handleNavigate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImage(0);
      }}
      className="group bg-white rounded-3xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative bg-slate-50 p-4 sm:p-5">
        {/* Availability Badge */}
        <div
          className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 ${availableStock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${availableStock > 0 ? "bg-green-500" : "bg-red-500"}`}
          />

          {availableStock > 0 ? "Available" : "Out of Stock"}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-slate-100"
        >
          <Heart size={18} />
        </button>

        {/* Photos Count */}
        {images?.length > 1 && (
          <div className="absolute bottom-4 right-4 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {images.length} Photos
          </div>
        )}

        {/* Product Image */}
        <div className="h-48 sm:h-56 md:h-60 flex items-center justify-center">
          {images?.length > 0 ? (
            <img
              src={images[currentImage]}
              alt={name}
              className="max-h-full object-contain transition-all duration-3000 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <Camera size={48} />

              <span className="text-sm mt-2">No Image</span>
            </div>
          )}
        </div>

        {/* Dots */}
        {images?.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-2 rounded-full transition-all duration-700 ${currentImage === index ? "w-6 bg-slate-900" : "w-2 bg-slate-300"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
      {/* Name */}
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 line-clamp-2">
          {name}
        </h3>

        {/* Category */}
        <div className="mt-3">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
            {category}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-4">
          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="font-medium">
            {averageRating || 0}
          </span>

          <span className="text-slate-400 text-sm">
            Rating
          </span>
        </div>

        {/* Price */}
        <div className="mt-4">
          <p className="text-slate-500 text-sm">
            From
          </p>

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
            className={
              availableStock > 0
                ? "text-green-600"
                : "text-red-600"
            }
          />

          <span
            className={`font-medium text-sm ${
              availableStock > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {availableStock > 0
              ? `${availableStock} Available`
              : "Out of Stock"}
          </span>
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="w-full mt-5 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300"
        >
          <Eye size={18} />
          View Details
        </button>
      </div>
    </div>
  );
}

