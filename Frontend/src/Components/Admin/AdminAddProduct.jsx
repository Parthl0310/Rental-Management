import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Plus,
  X,
  Package,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";

// Import your API
import { createProductAPI } from "../../Api/Product.api";

export default function AdminAddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    totalStock: "",

    perHour: "",
    perDay: "",
    perWeek: "",
    perMonth: "",

    extraHourCharge: "",
    extraDayCharge: "",

    depositAmount: "",
    lateFeePerDay: "",
    taxPercent: "",

    isAvailable: true,
  });

  const [colorInput, setColorInput] = useState("");
  const [colors, setColors] = useState([]);

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const categories = [
    "Camera",
    "Lens",
    "Drone",
    "Lighting",
    "Audio Equipment",
    "Accessories",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addColor = () => {
    const trimmed = colorInput.trim();

    if (!trimmed) return;

    if (!colors.includes(trimmed)) {
      setColors([...colors, trimmed]);
    }

    setColorInput("");
  };

  const removeColor = (color) => {
    setColors(colors.filter((item) => item !== color));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const productData = new FormData();

      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("category", formData.category);
      productData.append("totalStock", formData.totalStock);

      productData.append("colors", colors.join(","));

      productData.append("pricing.perHour", formData.perHour);
      productData.append("pricing.perDay", formData.perDay);
      productData.append("pricing.perWeek", formData.perWeek);
      productData.append("pricing.perMonth", formData.perMonth);

      productData.append(
        "extraHourCharge",
        formData.extraHourCharge
      );

      productData.append(
        "extraDayCharge",
        formData.extraDayCharge
      );

      productData.append(
        "depositAmount",
        formData.depositAmount
      );

      productData.append(
        "lateFeePerDay",
        formData.lateFeePerDay
      );

      productData.append(
        "taxPercent",
        formData.taxPercent
      );

      productData.append(
        "isAvailable",
        formData.isAvailable
      );

      images.forEach((image) => {
        productData.append("images", image);
      });

      await createProductAPI(productData);

      navigate("/admin/products");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Add New Product
            </h1>

            <p className="text-slate-500 mt-1">
              Create and manage rental products
            </p>
          </div>

          <button
            type="submit"
            form="productForm"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold transition-all shadow-lg shadow-sky-200"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>

        <form
          id="productForm"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6"
        >
          {/* LEFT SECTION */}

          <div className="space-y-6">
            {/* General Product Information */}

            <div className="bg-white rounded-3xl border border-sky-100 shadow-lg shadow-sky-100/40 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-sky-500" />

                <h2 className="text-xl font-bold text-slate-800">
                  General Product Information
                </h2>
              </div>

              <div className="space-y-5">
                {/* Product Name */}

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                    className="w-full h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                {/* Category */}

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="">
                      Select Category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total Stock */}

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Total Stock *
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="totalStock"
                    value={formData.totalStock}
                    onChange={handleChange}
                    required
                    placeholder="Enter total stock"
                    className="w-full h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                {/* Colors */}

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Colors
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) =>
                        setColorInput(e.target.value)
                      }
                      placeholder="Add color"
                      className="flex-1 h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={addColor}
                      className="px-4 rounded-xl bg-sky-500 text-white"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {colors.map((color) => (
                      <div
                        key={color}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-sky-100 text-sky-700"
                      >
                        <span>{color}</span>

                        <button
                          type="button"
                          onClick={() =>
                            removeColor(color)
                          }
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    rows={6}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description..."
                    className="w-full p-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
                        {/* Product Images */}

            <div className="bg-white rounded-3xl border border-sky-100 shadow-lg shadow-sky-100/40 p-6">
              <div className="flex items-center gap-3 mb-6">
                <ImageIcon className="w-6 h-6 text-sky-500" />

                <h2 className="text-xl font-bold text-slate-800">
                  Product Images
                </h2>
              </div>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-sky-300 rounded-2xl p-8 cursor-pointer hover:bg-sky-50 transition">
                <Upload className="w-10 h-10 text-sky-500 mb-3" />

                <p className="font-medium text-slate-700">
                  Upload Product Images
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  PNG, JPG, WEBP
                </p>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {previewImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-2xl border border-sky-100"
                    >
                      <img
                        src={image}
                        alt={`preview-${index}`}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION */}

          <div className="space-y-6">
            {/* Rental Pricing */}

            <div className="bg-white rounded-3xl border border-sky-100 shadow-lg shadow-sky-100/40 p-6">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-sky-500" />

                <h2 className="text-xl font-bold text-slate-800">
                  Rental Pricing
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Per Hour
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="perHour"
                    value={formData.perHour}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Per Day
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="perDay"
                    value={formData.perDay}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Per Week
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="perWeek"
                    value={formData.perWeek}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Per Month
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="perMonth"
                    value={formData.perMonth}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Reservation Charges */}

            <div className="bg-white rounded-3xl border border-sky-100 shadow-lg shadow-sky-100/40 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Reservation Charges
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Extra Hour Charge
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="extraHourCharge"
                    value={formData.extraHourCharge}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Extra Day Charge
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="extraDayCharge"
                    value={formData.extraDayCharge}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Additional Charges */}

            <div className="bg-white rounded-3xl border border-sky-100 shadow-lg shadow-sky-100/40 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Additional Charges
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Deposit Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="depositAmount"
                    value={formData.depositAmount}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Late Fee Per Day
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="lateFeePerDay"
                    value={formData.lateFeePerDay}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Tax Percentage
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="taxPercent"
                    value={formData.taxPercent}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Product Status */}

            <div className="bg-white rounded-3xl border border-sky-100 shadow-lg shadow-sky-100/40 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Product Status
              </h2>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="w-5 h-5 accent-sky-500"
                />

                <span className="text-slate-700 font-medium">
                  Available For Rental
                </span>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}