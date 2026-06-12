import React, { useState } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

export default function ProductFilters({
  filters,
  onFilterChange,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Categories
  const categories = [
    "Sneakers",
    "Football",
    "Cricket",
    "Cycling",
    "Camping",
  ];

  // Colors
  const colors = [
    "white",
    "black",
    "blue",
    "green",
    "red",
  ];

  // Category Toggle
  const handleCategoryChange = (category) => {
    const updatedCategories =
      filters.categories.includes(category)
        ? filters.categories.filter(
            (item) => item !== category
          )
        : [...filters.categories, category];

    onFilterChange({
      ...filters,
      categories: updatedCategories,
    });
  };

  // Color Toggle
  const handleColorChange = (color) => {
    const updatedColors =
      filters.colors.includes(color)
        ? filters.colors.filter(
            (item) => item !== color
          )
        : [...filters.colors, color];

    onFilterChange({
      ...filters,
      colors: updatedColors,
    });
  };

  // Price Change
  const handlePriceChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  // Sort Change
  const handleSortChange = (e) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value,
    });
  };

  // Clear All Filters
  const handleClearFilters = () => {
    onFilterChange({
      categories: [],
      colors: [],
      minPrice: "",
      maxPrice: "",
      sortBy: "",
    });
  };

  const sidebarClasses = `
    w-full
    bg-white
    border
    border-slate-200
    rounded-3xl
    p-6
    shadow-sm
  `;
    return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden w-full mb-3 flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-200 bg-white"
      >
        <SlidersHorizontal size={18} />
        Filters
      </button>

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarClasses}
          ${
            mobileOpen
              ? "block"
              : "hidden lg:block"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Filters
          </h2>

          <button
            onClick={handleClearFilters}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Clear All
          </button>
        </div>

        {/* Categories */}
        <div className="pb-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-900">
              Categories
            </h3>

            <ChevronDown size={18} />
          </div>

          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(
                    category
                  )}
                  onChange={() =>
                    handleCategoryChange(category)
                  }
                  className="w-4 h-4 rounded border-slate-300"
                />

                <span className="text-sm text-slate-700">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="py-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-900">
              Colors
            </h3>

            <ChevronDown size={18} />
          </div>

          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() =>
                  handleColorChange(color)
                }
                className={`
                  w-8 h-8 rounded-full border-2 transition
                  ${
                    filters.colors.includes(color)
                      ? "border-sky-500 scale-110"
                      : "border-transparent"
                  }
                `}
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="py-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-900">
              Price Range
            </h3>

            <ChevronDown size={18} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) =>
                handlePriceChange(
                  "minPrice",
                  e.target.value
                )
              }
              className="h-11 px-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) =>
                handlePriceChange(
                  "maxPrice",
                  e.target.value
                )
              }
              className="h-11 px-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="py-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-900">
              Sort By
            </h3>

            <ChevronDown size={18} />
          </div>

          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="priceLowToHigh">
                    Price: Low to High
                  </option>

                  <option value="priceHighToLow">
                    Price: High to Low
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>
          </select>
        </div>

        {/* Footer */}
        <button
          onClick={handleClearFilters}
          className="w-full mt-6 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 transition font-medium text-slate-800"
        >
          Clear All Filters
        </button>
      </aside>
    </>
  );
}