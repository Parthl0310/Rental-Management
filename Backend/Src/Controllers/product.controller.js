import { Product } from "../Models/Product.model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { uploadoncloudinary } from "../Config/cloudinary.js";
import {
  calculateRentalPrice,
  applyDiscount,
} from "../Services.js/pricing.service.js";
import { PriceList } from "../Models/Pricelist.model.js";
import { RentalOrder } from "../Models/RentalOrder.model.js";

const createProduct = AsyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    colors,
    totalStock,
    extraHourCharge,
    extraDayCharge,
    depositAmount,
    lateFeePerDay,
    taxPercent,
    isAvailable,
  } = req.body;

  if (
    !name?.trim() ||
    !category?.trim() ||
    totalStock === undefined ||
    totalStock === null ||
    totalStock === ""
  ) {
    throw new ApiError(400, "Name, Category and Total Stock are required");
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  const imageUrls = [];
  for (const file of req.files) {
    const uploadedImage = await uploadoncloudinary(file.path);
    //   console.log(uploadedImage  );

    if (!uploadedImage) {
      throw new ApiError(500, "Error while uploading product image");
    }

    imageUrls.push(uploadedImage.url);
  }

  const product = await Product.create({
    name: name.trim(),
    description,
    category: category.trim(),
    colors: colors
      ? Array.isArray(colors)
        ? colors
        : colors.split(",").map((color) => color.trim())
      : [],
    images: imageUrls,

    totalStock: Number(totalStock),
    availableStock: Number(totalStock),

    pricing: {
      perHour: Number(req.body["pricing.perHour"]) || 0,
      perDay: Number(req.body["pricing.perDay"]) || 0,
      perWeek: Number(req.body["pricing.perWeek"]) || 0,
      perMonth: Number(req.body["pricing.perMonth"]) || 0,
    },

    extraHourCharge: Number(extraHourCharge) || 0,
    extraDayCharge: Number(extraDayCharge) || 0,
    depositAmount: Number(depositAmount) || 0,
    lateFeePerDay: Number(lateFeePerDay) || 0,
    taxPercent: Number(taxPercent) || 0,

    isAvailable: isAvailable === undefined ? true : isAvailable === "true",
  });

  if (!product) {
    throw new ApiError();
  }
  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product added successfully"));
});

const getAllProducts = AsyncHandler(async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    colors,
    sortBy,
    page = 1,
    limit = 12,
  } = req.query;

  const query = {
    isAvailable: true,
  };

  // Search
  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // Category Filter
  if (category) {
    query.category = {
      $in: category.split(","),
    };
  }

  // Price Filter
  if (minPrice || maxPrice) {
    query["pricing.perDay"] = {};

    if (minPrice) {
      query["pricing.perDay"].$gte = Number(minPrice);
    }

    if (maxPrice) {
      query["pricing.perDay"].$lte = Number(maxPrice);
    }
  }

  // Color Filter
  if (colors) {
    const colorsArray = colors.split(",").map((color) => color.trim());

    query.colors = {
      $in: colorsArray,
    };
  }

  // Sorting
  let sortOptions = { createdAt: -1 };

  if (sortBy === "priceLowToHigh") {
    sortOptions = { "pricing.perDay": 1 };
  }

  if (sortBy === "priceHighToLow") {
    sortOptions = { "pricing.perDay": -1 };
  }

  if (sortBy === "rating") {
    sortOptions = { averageRating: -1 };
  }

  const currentPage = Number(page);
  const pageLimit = Number(limit);

  const products = await Product.find(query)
    .sort(sortOptions)
    .skip((currentPage - 1) * pageLimit)
    .limit(pageLimit);
  const totalProducts = await Product.countDocuments(query);

  const totalPages = Math.ceil(totalProducts / pageLimit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        totalProducts,
        currentPage,
        totalPages,
      },
      "Products fetched successfully"
    )
  );
});

const getSingleProduct = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product Is Not Found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product Fetched successfully"));
});

const updateProduct = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product Is Not Found");
  }

  const {
    name,
    description,
    category,
    colors,
    totalStock,
    extraHourCharge,
    extraDayCharge,
    depositAmount,
    lateFeePerDay,
    taxPercent,
    isAvailable,
    pricing,
  } = req.body;

  const imageUrls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadedImage = await uploadoncloudinary(file.path);

      if (!uploadedImage) {
        throw new ApiError(500, "Error while uploading product image");
      }

      imageUrls.push(uploadedImage.url);
    }
  }

  const updateData = {
    name: name ? name : product.name,
    description: description ? description : product.description,
    category: category ? category : product.category,
    totalStock: totalStock ? Number(totalStock) : product.totalStock,
    extraHourCharge: extraHourCharge
      ? Number(extraHourCharge)
      : product.extraHourCharge,
    extraDayCharge: extraDayCharge
      ? Number(extraDayCharge)
      : product.extraDayCharge,
    depositAmount: depositAmount
      ? Number(depositAmount)
      : product.depositAmount,
    lateFeePerDay: lateFeePerDay
      ? Number(lateFeePerDay)
      : product.lateFeePerDay,
    taxPercent: taxPercent ? Number(taxPercent) : product.taxPercent,
    isAvailable:
      isAvailable !== undefined ? isAvailable === "true" : product.isAvailable,
    colors: colors
      ? Array.isArray(colors)
        ? colors
        : colors.split(",").map((color) => color.trim())
      : product.colors,

    pricing: {
      perHour:
        req.body["pricing.perHour"] !== undefined
          ? Number(req.body["pricing.perHour"])
          : product.pricing.perHour,

      perDay:
        req.body["pricing.perDay"] !== undefined
          ? Number(req.body["pricing.perDay"])
          : product.pricing.perDay,

      perWeek:
        req.body["pricing.perWeek"] !== undefined
          ? Number(req.body["pricing.perWeek"])
          : product.pricing.perWeek,

      perMonth:
        req.body["pricing.perMonth"] !== undefined
          ? Number(req.body["pricing.perMonth"])
          : product.pricing.perMonth,
    },
    images: imageUrls.length > 0 ? imageUrls : product.images,
  };

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        product: updatedProduct,
      },
      "Product Upadated successfully"
    )
  );
});

const deleteProduct = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product Is Not Found");
  }

  const foundOrder=await RentalOrder.exists({product:id,status:{
    $nin:["cancelled","returned"]
  }})

  if(foundOrder){
    throw new ApiError(400, "Cannot delete product with active rentals");
  }

  const deleteProduct = await Product.findByIdAndDelete(id);
  if (!deleteProduct) {
    throw new ApiError(404, "Failed to delete product");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deleteProduct, "Product Deleted SuccesFully"));
});

const updateStock = AsyncHandler(async (req, res) => {
  const { id, totalStock } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product Is Not Found");
  }

  const stock = Number(totalStock);

  if (isNaN(stock) || stock < 0) {
    throw new ApiError(400, "Invalid Product Stock");
  }

  
  const activeRentalCount =await  RentalOrder.countDocuments({
    product: id,
    status: { $in: ["reserved", "pickedup"] }
  })
  const availableStock = stock-activeRentalCount;

  if (availableStock < 0) {
    availableStock = 0;
  }
  
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      totalStock: stock,
      availableStock,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        product: updatedProduct,
      },
      "Product Stock Updated Successfully"
    )
  );
});

const getProductAvailability = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product Is Not Found");
  }

  const bookedDates = await RentalOrder.find({
    product: id,
    status: { $nin: ["cancelled", "returned"] }
  }).select("startDate endDate -_id")

  return res
    .status(200)
    .json(
      new ApiResponse(200, bookedDates, "SuccesFully Get Product availability")
    );
});

const calculatePrice = AsyncHandler(async (req, res) => {
  const { id, startDate, endDate, quantity, pricelistId } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product Is Not Found");
  }

  let priceList = null;

  if (pricelistId) {
    priceList = await PriceList.findById(pricelistId);
  }

  const calculatedPrice = calculateRentalPrice(
    product,
    startDate,
    endDate,
    quantity
  );

  const { discountedAmount, discountAmount } = applyDiscount(
    calculatedPrice.baseAmount,
    priceList
  );

  const taxAmount = discountedAmount * (product.taxPercent / 100);

  const totalAmount = discountedAmount + taxAmount + product.depositAmount;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...calculatedPrice,

        baseAmount: calculatedPrice.baseAmount,

        discountedAmount,
        discountAmount,

        taxAmount,
        totalAmount,
      },
      "Price calculated successfully"
    )
  );
});

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getProductAvailability,
  calculatePrice,
};
