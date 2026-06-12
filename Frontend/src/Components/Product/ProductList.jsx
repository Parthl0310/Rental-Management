import React, { useEffect, useState } from "react";
import {
  Search,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import ProductFilters from "../../components/product/ProductFilters";
import ProductCard from "../../components/product/ProductCard";

import { getAllProductsAPI } from "../../api/product.api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    categories: searchParams.get("categories")?.split(",") || [],
    colors: searchParams.get("colors")?.split(",") || [],
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "rating",
  });
  useEffect(() => {
    const params = {};

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.categories?.length) {
      params.category = filters.categories[0];
    }

    if (filters.colors?.length) {
      params.colors = filters.colors.join(",");
    }

    if (filters.minPrice) {
      params.minPrice = filters.minPrice;
    }

    if (filters.maxPrice) {
      params.maxPrice = filters.maxPrice;
    }

    if (filters.sortBy) {
      params.sortBy = filters.sortBy;
    }

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const [viewMode, setViewMode] = useState("card");

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const [showMobileFilters, setShowMobileFilters] =
    useState(false);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Fetch products whenever filters/page changes
  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

    const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const res = await getAllProductsAPI({
        search: filters.search,
        category: filters.categories[0] || "",
        colors: filters.colors.join(","),
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy: filters.sortBy,
        page: currentPage,
      });

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
return (
  <>
    <Navbar />

    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 py-6">

        {/* MOBILE FILTER BUTTON */}
        <button
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden flex items-center gap-2 px-4 h-11 rounded-xl border border-slate-200 bg-white mb-4"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>

        {/* MOBILE FILTER DRAWER */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black/40">
            <div className="absolute left-0 top-0 h-full w-80 bg-white p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold">
                  Filters
                </h2>

                <button
                  onClick={() =>
                    setShowMobileFilters(false)
                  }
                >
                  <X size={22} />
                </button>
              </div>

              <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
              />
            </div>
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">

          {/* SIDEBAR */}
          <div className="hidden lg:block sticky top-24 self-start">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          {/* PRODUCT SECTION */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

            {/* TOOLBAR */}
            <div className="mb-6">
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">

                {/* SEARCH */}
                <div className="relative flex-1 min-w-[250px]">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                {/* SORT */}
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value,
                    }))
                  }
                  className="h-11 w-52 px-3 rounded-xl border border-slate-200"
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

                {/* VIEW TOGGLE */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setViewMode("card")}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                      viewMode === "card"
                        ? "bg-sky-500 text-white"
                        : "bg-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    <Grid3X3 size={18} />
                  </button>

                  <button
                    onClick={() => setViewMode("list")}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                      viewMode === "list"
                        ? "bg-sky-500 text-white"
                        : "bg-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* LOADING */}
            {isLoading ? (
              <div
                className={
                  viewMode === "card"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
                    : "space-y-4"
                }
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-3xl overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-slate-200" />

                    <div className="p-4">
                      <div className="h-4 bg-slate-200 rounded mb-3" />
                      <div className="h-4 bg-slate-200 rounded w-2/3 mb-3" />
                      <div className="h-8 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (

              /* EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-20">
                <h3 className="text-2xl font-semibold text-slate-700">
                  No Products Found
                </h3>

                <p className="text-slate-500 mt-2">
                  Try changing your filters.
                </p>
              </div>

            ) : viewMode === "card" ? (

              /* CARD VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>

            ) : (

              /* LIST VIEW */
              <div className="space-y-5">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="border border-slate-200 rounded-3xl p-5 flex flex-col lg:flex-row justify-between gap-5"
                  >
                    <div>
                      <h3 className="text-xl font-semibold">
                        {product.name}
                      </h3>

                      <p className="text-slate-500 mt-2">
                        Category: {product.category}
                      </p>

                      <p className="text-slate-500 mt-2">
                        Rating: {product.averageRating}
                      </p>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-3">
                      <h4 className="text-2xl font-bold">
                        ₹{product.pricing?.perDay || 0}/day
                      </h4>

                      <button
                        className="px-5 h-11 rounded-xl bg-sky-500 text-white hover:bg-sky-600"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">

                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.max(prev - 1, 1)
                    )
                  }
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from(
                  { length: Math.min(totalPages, 10) },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`w-10 h-10 rounded-xl transition ${
                      currentPage === page
                        ? "bg-sky-500 text-white"
                        : "border border-slate-200 hover:border-sky-500"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  </>
);
}