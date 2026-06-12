import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import Sidebar from "../../components/common/Sidebar";

import {
  getAllProductsAPI,
  deleteProductAPI,
  updateProductAPI,
} from "../../api/product.api";

export default function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  useEffect(() => {
    fetchProducts();
  }, [search, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res =
        await getAllProductsAPI({
          search,
          page: currentPage,
        });

      setProducts(
        res.data.products || []
      );

      setTotalPages(
        res.data.totalPages || 1
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Delete this product?"
      );

    if (!confirmed) return;

    try {
      await deleteProductAPI(id);

      toast.success(
        "Product deleted"
      );

      fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete product"
      );
    }
  };

  const handleStatusToggle =
    async (product) => {
      try {
        const formData =
          new FormData();

        formData.append(
          "isAvailable",
          !product.isAvailable
        );

        await updateProductAPI(
          product._id,
          formData
        );

        toast.success(
          "Status updated"
        );

        fetchProducts();
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to update status"
        );
      }
    };

  return (
    <>
      <Sidebar />

      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
                    {/* Header */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Products Management
              </h1>

              <p className="text-slate-500 mt-1">
                Manage all rental products
              </p>
            </div>

            <button
              onClick={() =>
                navigate(
                  "/admin/products/create"
                )
              }
              className="h-12 px-5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium flex items-center gap-2"
            >
              <Plus size={18} />
              Create Product
            </button>

          </div>

          {/* Search */}

          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500"
              />

            </div>

          </div>

          {/* Table */}

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">

            {loading ? (

              <div className="p-10 text-center">
                Loading products...
              </div>

            ) : products.length === 0 ? (

              <div className="p-10 text-center">

                <h3 className="text-xl font-semibold text-slate-700">
                  No Products Found
                </h3>

                <p className="text-slate-500 mt-2">
                  Create your first product.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50 border-b border-slate-200">

                    <tr>

                      <th className="px-4 py-4 text-left text-sm font-semibold">
                        Image
                      </th>

                      <th className="px-4 py-4 text-left text-sm font-semibold">
                        Product
                      </th>

                      <th className="px-4 py-4 text-left text-sm font-semibold">
                        Category
                      </th>

                      <th className="px-4 py-4 text-left text-sm font-semibold">
                        Stock
                      </th>

                      <th className="px-4 py-4 text-left text-sm font-semibold">
                        Price / Day
                      </th>

                      <th className="px-4 py-4 text-left text-sm font-semibold">
                        Status
                      </th>

                      <th className="px-4 py-4 text-left text-sm font-semibold">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {products.map(
                      (product) => (
                        <tr
                          key={
                            product._id
                          }
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >

                          {/* Image */}

                          <td className="px-4 py-4">

                            {product.images
                              ?.length >
                            0 ? (
                              <img
                                src={
                                  product
                                    .images[0]
                                }
                                alt={
                                  product.name
                                }
                                className="w-16 h-16 rounded-xl object-cover border"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                                No Image
                              </div>
                            )}

                          </td>

                          {/* Name */}

                          <td className="px-4 py-4 font-medium">
                            {
                              product.name
                            }
                          </td>

                          {/* Category */}

                          <td className="px-4 py-4">
                            {
                              product.category
                            }
                          </td>

                          {/* Stock */}

                          <td className="px-4 py-4">
                            {
                              product.availableStock
                            }
                            /
                            {
                              product.totalStock
                            }
                          </td>

                          {/* Price */}

                          <td className="px-4 py-4">
                            ₹
                            {product
                              .pricing
                              ?.perDay ||
                              0}
                          </td>

                          {/* Status */}

                          <td className="px-4 py-4">

                            <button
                              onClick={() =>
                                handleStatusToggle(
                                  product
                                )
                              }
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                product.isAvailable
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.isAvailable
                                ? "Available"
                                : "Unavailable"}
                            </button>

                          </td>

                          {/* Actions */}

                          <td className="px-4 py-4">

                            <div className="flex items-center gap-2">

                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/products/edit/${product._id}`
                                  )
                                }
                                className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-200"
                              >
                                <Pencil
                                  size={
                                    18
                                  }
                                />
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    product._id
                                  )
                                }
                                className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                              >
                                <Trash2
                                  size={
                                    18
                                  }
                                />
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          {/* Pagination */}

          {!loading &&
            totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                    className={`w-10 h-10 rounded-xl ${
                      currentPage ===
                      page
                        ? "bg-sky-500 text-white"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              </div>
            )}

        </div>
      </div>
    </>
  );
}