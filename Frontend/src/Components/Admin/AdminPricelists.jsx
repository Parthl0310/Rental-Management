import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
  Tag,
  Calendar,
  Users,
  Loader2,
  Trash2,
  Pencil,
} from "lucide-react";

import Sidebar from "../../components/common/Sidebar";

import {
  getAllPricelistsAPI,
  createPricelistAPI,
  updatePricelistAPI,
  deletePricelistAPI,
} from "../../Api/Pricelist.api";

import {
  getAllProductsAPI,
} from "../../Api/Product.api";

export default function AdminPricelists() {
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [pricelists, setPricelists] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [
    customerGroupFilter,
    setCustomerGroupFilter,
  ] = useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      product: "",
      category: "",
      rentalPeriod: "daily",
      price: "",
      discountType: "percent",
      discountValue: "",
      customerGroup: "all",
      validFrom: "",
      validTo: "",
      isActive: true,
    });

  // ===========================
  // FETCH PRICE LISTS
  // ===========================

  const fetchPricelists = async () => {
    try {
      setLoading(true);

      const response =
        await getAllPricelistsAPI();

      setPricelists(
        response?.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // FETCH PRODUCTS
  // ===========================

  const fetchProducts = async () => {
    try {
      const response =
        await getAllProductsAPI();

      setProducts(
        response?.data?.products || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ===========================
  // LOAD DATA
  // ===========================

  useEffect(() => {
    fetchPricelists();
    fetchProducts();
  }, []);

  // ===========================
  // FORM CHANGE
  // ===========================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ===========================
  // CREATE / UPDATE
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        price: Number(
          formData.price
        ),
        discountValue: Number(
          formData.discountValue
        ),
      };

      if (isEditing) {
        await updatePricelistAPI(
          editingId,
          payload
        );
      } else {
        await createPricelistAPI(
          payload
        );
      }

      await fetchPricelists();

      setShowModal(false);

      setIsEditing(false);
      setEditingId(null);

      setFormData({
        name: "",
        product: "",
        category: "",
        rentalPeriod: "daily",
        price: "",
        discountType: "percent",
        discountValue: "",
        customerGroup: "all",
        validFrom: "",
        validTo: "",
        isActive: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // ===========================
  // EDIT
  // ===========================

  const handleEdit = (item) => {
    setIsEditing(true);

    setEditingId(item._id);

    setFormData({
      name: item.name || "",
      product:
        item.product?._id || "",
      category:
        item.category || "",
      rentalPeriod:
        item.rentalPeriod ||
        "daily",
      price: item.price || "",
      discountType:
        item.discountType ||
        "percent",
      discountValue:
        item.discountValue || "",
      customerGroup:
        item.customerGroup ||
        "all",
      validFrom:
        item.validFrom
          ?.split("T")[0] || "",
      validTo:
        item.validTo
          ?.split("T")[0] || "",
      isActive:
        item.isActive,
    });

    setShowModal(true);
  };

  // ===========================
  // DELETE
  // ===========================

  const handleDelete = async (
    id
  ) => {
    try {
      const confirmDelete =
        window.confirm(
          "Delete this pricelist?"
        );

      if (!confirmDelete)
        return;

      await deletePricelistAPI(
        id
      );

      fetchPricelists();
    } catch (error) {
      console.error(error);
    }
  };

  // ===========================
  // FILTERED DATA
  // ===========================

  const filteredPricelists =
    useMemo(() => {
      return pricelists.filter(
        (item) => {
          const today =
            new Date();

          today.setHours(
            0,
            0,
            0,
            0
          );

          const validTo =
            new Date(
              item.validTo
            );

          validTo.setHours(
            0,
            0,
            0,
            0
          );

          const expired =
            validTo < today;

          const matchesSearch =
            item.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            item.product?.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            item.category
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =
            !statusFilter ||
            (statusFilter ===
              "active" &&
              !expired) ||
            (statusFilter ===
              "expired" &&
              expired);

          const matchesCustomer =
            !customerGroupFilter ||
            item.customerGroup ===
              customerGroupFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesCustomer
          );
        }
      );
    }, [
      pricelists,
      search,
      statusFilter,
      customerGroupFilter,
    ]);

  const totalPricelists =
    pricelists.length;

  const activePricelists =
    pricelists.filter(
      (item) =>
        new Date(
          item.validTo
        ) >= new Date()
    ).length;

  const expiredPricelists =
    pricelists.filter(
      (item) =>
        new Date(
          item.validTo
        ) < new Date()
    ).length;

  return (
    <>
      <Sidebar />
    <div className="flex min-h-screen bg-slate-50">


      <div className="flex-1 p-8">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-5xl font-bold text-sky-900">
              Pricelists
            </h1>

            <p className="text-slate-500 mt-2">
              Manage rental pricing
              and discounts
            </p>
          </div>

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="
              flex items-center gap-2
              bg-sky-600
              hover:bg-sky-700
              text-white
              px-6 py-3
              rounded-xl
              font-semibold
              shadow-lg
            "
          >
            <Plus size={18} />
            Create Pricelist
          </button>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-3xl border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-600 font-medium">
                Total Pricelists
              </h3>

              <Tag
                size={24}
                className="text-sky-600"
              />
            </div>

            <h2 className="text-4xl font-bold text-sky-900 mt-5">
              {totalPricelists}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-green-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-600 font-medium">
                Active
              </h3>

              <Calendar
                size={24}
                className="text-green-600"
              />
            </div>

            <h2 className="text-4xl font-bold text-green-700 mt-5">
              {activePricelists}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-red-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-600 font-medium">
                Expired
              </h3>

              <Users
                size={24}
                className="text-red-600"
              />
            </div>

            <h2 className="text-4xl font-bold text-red-700 mt-5">
              {expiredPricelists}
            </h2>
          </div>

        </div>

        {/* FILTERS */}

        <div className="bg-white rounded-3xl border p-5 mb-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="relative">

              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                placeholder="Search pricelists..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="
                  w-full
                  pl-11
                  pr-4
                  py-3
                  border
                  rounded-xl
                  outline-none
                  focus:ring-2
                  focus:ring-sky-500
                "
              />
            </div>
                        <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="
                px-4
                py-3
                border
                rounded-xl
                outline-none
                focus:ring-2
                focus:ring-sky-500
              "
            >
              <option value="">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="expired">
                Expired
              </option>
            </select>

            <select
              value={customerGroupFilter}
              onChange={(e) =>
                setCustomerGroupFilter(
                  e.target.value
                )
              }
              className="
                px-4
                py-3
                border
                rounded-xl
                outline-none
                focus:ring-2
                focus:ring-sky-500
              "
            >
              <option value="">
                All Customers
              </option>

              <option value="all">
                All
              </option>

              <option value="corporate">
                Corporate
              </option>

              <option value="vip">
                VIP
              </option>
            </select>

          </div>
        </div>

        {/* TABLE */}

        <div className="bg-white rounded-3xl border overflow-hidden">

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2
                className="animate-spin text-sky-600"
                size={40}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-100">

                  <tr>

                    <th className="px-5 py-4 text-left">
                      Name
                    </th>

                    <th className="px-5 py-4 text-left">
                      Product / Category
                    </th>

                    <th className="px-5 py-4 text-left">
                      Discount Type
                    </th>

                    <th className="px-5 py-4 text-left">
                      Discount Value
                    </th>

                    <th className="px-5 py-4 text-left">
                      Valid From
                    </th>

                    <th className="px-5 py-4 text-left">
                      Valid To
                    </th>

                    <th className="px-5 py-4 text-left">
                      Customer Group
                    </th>

                    <th className="px-5 py-4 text-left">
                      Status
                    </th>

                    <th className="px-5 py-4 text-center">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredPricelists.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-10 text-slate-500"
                      >
                        No Pricelists Found
                      </td>
                    </tr>
                  ) : (
                    filteredPricelists.map(
                      (item) => {
                        const today =
                          new Date();

                        today.setHours(
                          0,
                          0,
                          0,
                          0
                        );

                        const validTo =
                          new Date(
                            item.validTo
                          );

                        validTo.setHours(
                          0,
                          0,
                          0,
                          0
                        );

                        const isExpired =
                          validTo < today;

                        return (
                          <tr
                            key={item._id}
                            className="
                              border-t
                              hover:bg-slate-50
                            "
                          >

                            <td className="px-5 py-5 font-medium">
                              {item.name}
                            </td>

                            <td className="px-5 py-5">
                              {item.product?.name ||
                                item.category ||
                                "-"}
                            </td>

                            <td className="px-5 py-5 capitalize">
                              {item.discountType}
                            </td>

                            <td className="px-5 py-5">
                              {item.discountType ===
                              "percent"
                                ? `${item.discountValue}%`
                                : `₹${item.discountValue}`}
                            </td>

                            <td className="px-5 py-5">
                              {item.validFrom
                                ? new Date(
                                    item.validFrom
                                  ).toLocaleDateString()
                                : "-"}
                            </td>

                            <td className="px-5 py-5">
                              {item.validTo
                                ? new Date(
                                    item.validTo
                                  ).toLocaleDateString()
                                : "-"}
                            </td>

                            <td className="px-5 py-5 capitalize">
                              {item.customerGroup}
                            </td>

                            <td className="px-5 py-5">

                              {isExpired ? (
                                <span
                                  className="
                                    px-3 py-1
                                    rounded-full
                                    bg-red-100
                                    text-red-700
                                    text-xs
                                    font-semibold
                                  "
                                >
                                  Expired
                                </span>
                              ) : (
                                <span
                                  className="
                                    px-3 py-1
                                    rounded-full
                                    bg-green-100
                                    text-green-700
                                    text-xs
                                    font-semibold
                                  "
                                >
                                  Active
                                </span>
                              )}

                            </td>

                            <td className="px-5 py-5">

                              <div className="flex justify-center gap-2">

                                <button
                                  onClick={() =>
                                    handleEdit(
                                      item
                                    )
                                  }
                                  className="
                                    p-2
                                    rounded-lg
                                    bg-sky-100
                                    text-sky-700
                                    hover:bg-sky-200
                                  "
                                >
                                  <Pencil
                                    size={16}
                                  />
                                </button>

                                <button
                                  onClick={() =>
                                    handleDelete(
                                      item._id
                                    )
                                  }
                                  className="
                                    p-2
                                    rounded-lg
                                    bg-red-100
                                    text-red-700
                                    hover:bg-red-200
                                  "
                                >
                                  <Trash2
                                    size={16}
                                  />
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* MODAL */}

        {showModal && (
          <div
            className="
              fixed inset-0
              bg-black/40
              z-50
              flex items-center justify-center
              p-4
            "
          >
            <div
              className="
                bg-white
                rounded-3xl
                shadow-2xl
                w-full
                max-w-4xl
                max-h-[90vh]
                overflow-y-auto
              "
            >
              <div className="p-6 border-b">

                <div className="flex justify-between items-center">

                  <h2 className="text-2xl font-bold text-sky-900">
                    {isEditing
                      ? "Edit Pricelist"
                      : "Create Pricelist"}
                  </h2>

                  <button
                    onClick={() => {
                      setShowModal(false);
                      setIsEditing(false);
                      setEditingId(null);
                    }}
                    className="
                      h-10
                      w-10
                      rounded-full
                      bg-slate-100
                    "
                  >
                    ✕
                  </button>

                </div>

              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6"
              >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Pricelist Name"
                    className="border rounded-xl px-4 py-3"
                    required
                  />

                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="border rounded-xl px-4 py-3"
                  >
                    <option value="">
                      Select Product
                    </option>

                    {Array.isArray(products) &&
                      products.map(
                        (product) => (
                          <option
                            key={product._id}
                            value={
                              product._id
                            }
                          >
                            {product.name}
                          </option>
                        )
                      )}
                  </select>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Category"
                    className="border rounded-xl px-4 py-3"
                  />

                  <select
                    name="rentalPeriod"
                    value={
                      formData.rentalPeriod
                    }
                    onChange={handleChange}
                    className="border rounded-xl px-4 py-3"
                  >
                    <option value="hourly">
                      Hourly
                    </option>

                    <option value="daily">
                      Daily
                    </option>

                    <option value="weekly">
                      Weekly
                    </option>

                    <option value="monthly">
                      Monthly
                    </option>
                  </select>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="border rounded-xl px-4 py-3"
                  />

                  <input
                    type="number"
                    name="discountValue"
                    value={
                      formData.discountValue
                    }
                    onChange={handleChange}
                    placeholder="Discount Value"
                    className="border rounded-xl px-4 py-3"
                  />

                  <div>
                    <label className="font-medium block mb-2">
                      Discount Type
                    </label>

                    <div className="flex gap-6">

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="discountType"
                          value="percent"
                          checked={
                            formData.discountType ===
                            "percent"
                          }
                          onChange={
                            handleChange
                          }
                        />
                        Percent
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="discountType"
                          value="fixed"
                          checked={
                            formData.discountType ===
                            "fixed"
                          }
                          onChange={
                            handleChange
                          }
                        />
                        Fixed
                      </label>

                    </div>
                  </div>

                  <select
                    name="customerGroup"
                    value={
                      formData.customerGroup
                    }
                    onChange={handleChange}
                    className="border rounded-xl px-4 py-3"
                  >
                    <option value="all">
                      All
                    </option>

                    <option value="corporate">
                      Corporate
                    </option>

                    <option value="vip">
                      VIP
                    </option>
                  </select>

                  <input
                    type="date"
                    name="validFrom"
                    value={
                      formData.validFrom
                    }
                    onChange={handleChange}
                    className="border rounded-xl px-4 py-3"
                  />

                  <input
                    type="date"
                    name="validTo"
                    value={
                      formData.validTo
                    }
                    onChange={handleChange}
                    className="border rounded-xl px-4 py-3"
                  />

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={
                        formData.isActive
                      }
                      onChange={handleChange}
                    />
                    Active Pricelist
                  </label>

                </div>

                <div className="flex justify-end gap-3 mt-8 border-t pt-6">

                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(false)
                    }
                    className="
                      px-5 py-3
                      border
                      rounded-xl
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      px-6 py-3
                      bg-sky-600
                      hover:bg-sky-700
                      text-white
                      rounded-xl
                    "
                  >
                    {isEditing
                      ? "Update Pricelist"
                      : "Create Pricelist"}
                  </button>

                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
    </>
  );
}