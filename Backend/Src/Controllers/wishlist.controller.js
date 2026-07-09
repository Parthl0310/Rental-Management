import mongoose from "mongoose";
import { Wishlist } from "../Models/Wishlist.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";

const getWishlist = AsyncHandler(async (req, res) => {
  const customerId = req.user._id;

  const wishlist = await Wishlist.findOne({ customer: customerId }).populate(
    "products",
    "name images pricing isAvailable availableStock averageRating"
  );

  if (!wishlist) {
    return res.status(200).json(new ApiResponse(200, [], "Empty wishlist"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist.products, "Wishlist fetched successfully"));
});

const toggleWishlist = AsyncHandler(async (req, res) => {
  const customerId = req.user._id;
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // Find or create wishlist
  const wishlist = await Wishlist.findOneAndUpdate(
    { customer: customerId },
    { $setOnInsert: { customer: customerId } },
    { upsert: true, new: true }
  );

  const productExists = wishlist.products.includes(productId);
  let isWishlisted = false;

  if (productExists) {
    // Remove it
    await Wishlist.updateOne(
      { customer: customerId },
      { $pull: { products: productId } }
    );
    isWishlisted = false;
  } else {
    // Add it
    await Wishlist.updateOne(
      { customer: customerId },
      { $addToSet: { products: productId } }
    );
    isWishlisted = true;
  }

  // Fetch updated wishlist to return
  const updatedWishlist = await Wishlist.findOne({ customer: customerId });

  return res.status(200).json(
    new ApiResponse(
      200,
      { isWishlisted, wishlist: updatedWishlist },
      isWishlisted ? "Added to wishlist" : "Removed from wishlist"
    )
  );
});

const checkWishlist = AsyncHandler(async (req, res) => {
  const customerId = req.user._id;
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const wishlist = await Wishlist.findOne({ customer: customerId });
  const isWishlisted = wishlist ? wishlist.products.includes(productId) : false;

  return res
    .status(200)
    .json(new ApiResponse(200, { isWishlisted }, "Wishlist status checked"));
});

export { getWishlist, toggleWishlist, checkWishlist };
