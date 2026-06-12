import React, { useState } from "react";
import { Camera } from "lucide-react";

export default function ImageGallery({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const hasImages = images && images.length > 0;

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* Thumbnail List */}
      {hasImages && (
        <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-sky-500 ring-2 ring-sky-100"
                  : "border-slate-200 hover:border-sky-300"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                onError={(e) => {
                  e.target.src = "/placeholder-product.png";
                }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="order-1 lg:order-2 flex-1">
        <div className="relative aspect-square rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {hasImages ? (
            <>
              <img
                key={selectedImage}
                src={images[selectedImage]}
                alt={`Product ${selectedImage + 1}`}
                onError={(e) => {
                  e.target.src = "/placeholder-product.png";
                }}
                className="w-full h-full object-contain p-6 animate-fadeIn hover:scale-105 transition-all duration-300"
              />

              {/* Image Counter */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-medium">
                {selectedImage + 1} / {images.length}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Camera size={70} />

              <p className="mt-3 text-sm font-medium">
                No Image Available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}