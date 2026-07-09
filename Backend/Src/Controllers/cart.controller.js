import { Cart } from "../Models/Cart.model.js";
import {ApiError} from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import { AsyncHandler } from "../Utils/AsyncHandler.js"
import {Product} from "../Models/Product.model.js"
import {calculateRentalPrice,applyDiscount} from "../Services.js/pricing.service.js"
import {Coupon} from "../Models/Coupon.model.js"


const getCart = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ customer: userId }).populate(
    "items.product",
    "name images isAvailable availableStock pricing taxPercent depositAmount"
  );

  const emptyCart = {
    items: [],
    couponDiscount: 0,
    deliveryCharge: 0,
    itemCount: 0,
  };

  if (!cart) {
    return res.status(200).json(
      new ApiResponse(
        200,
        emptyCart,
        "Empty cart returned successfully"
      )
    );
  }

  const cartData = cart.toObject();

  cartData.itemCount = cartData.items.length;

  return res.status(200).json(
    new ApiResponse(
      200,
      cartData,
      "Cart fetched successfully"
    )
  );
});

const addToCart = AsyncHandler(async (req, res) => {
  const { productId, quantity, startDate, endDate } = req.body;

  if (!productId || !quantity || !startDate || !endDate) {
    throw new ApiError(
      400,
      "Product, Quantity, Start Date and End Date are required"
    );
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.availableStock < quantity) {
    throw new ApiError(400, "Insufficient stock available");
  }

  const {
    pricePerUnit,
    baseAmount,
    durationType,
  } = calculateRentalPrice(
    product,
    startDate,
    endDate,
    quantity
  );

  let cart = await Cart.findOne({
    customer: req.user._id,
  });

  if (!cart) {
    cart = new Cart({
      customer: req.user._id,
      items: [
        {
          product: product._id,
          quantity,
          startDate,
          endDate,
          unitPrice: pricePerUnit,
          durationType,
          subTotal: baseAmount,
        },
      ],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity = quantity;
      existingItem.startDate = startDate;
      existingItem.endDate = endDate;
      existingItem.unitPrice = pricePerUnit;
      existingItem.durationType = durationType;
      existingItem.subTotal = baseAmount;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        startDate,
        endDate,
        unitPrice: pricePerUnit,
        durationType,
        subTotal: baseAmount,
      });
    }
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    "name images isAvailable availableStock pricing taxPercent depositAmount"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      populatedCart,
      "Product added to cart successfully"
    )
  );
});

const updateCartItem = AsyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { newQuantity, newStartDate, newEndDate } = req.body;

  const cart = await Cart.findOne({
    customer: req.user._id,
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(
      404,
      "Product not found in cart"
    );
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const cartItem = cart.items[itemIndex];

  // Update Quantity
  if (newQuantity) {
    if (newQuantity <= 0) {
      throw new ApiError(
        400,
        "Quantity must be greater than 0"
      );
    }

    if (product.availableStock < newQuantity) {
      throw new ApiError(
        400,
        "Insufficient stock available"
      );
    }

    cartItem.quantity = newQuantity;

    // Recalculate subtotal using stored unit price
    cartItem.subTotal =
      cartItem.unitPrice * newQuantity;
  }

  // Update Dates
  if (newStartDate || newEndDate) {
    const startDate =
      newStartDate || cartItem.startDate;

    const endDate =
      newEndDate || cartItem.endDate;

    const {
      pricePerUnit,
      baseAmount,
      durationType,
    } = calculateRentalPrice(
      product,
      startDate,
      endDate,
      cartItem.quantity
    );

    cartItem.startDate = startDate;
    cartItem.endDate = endDate;
    cartItem.unitPrice = pricePerUnit;
    cartItem.durationType = durationType;
    cartItem.subTotal = baseAmount;
  }

  await cart.save();

  const updatedCart = await Cart.findById(
    cart._id
  ).populate(
    "items.product",
    "name images isAvailable availableStock pricing taxPercent depositAmount"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedCart,
      "Cart item updated successfully"
    )
  );
});

const removeCartItem = AsyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ customer: req.user._id }).populate(
    "items.product",
    "name images isAvailable availableStock pricing taxPercent depositAmount"
  );

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product._id.toString() !== productId
  );

  // If coupon was applied, check if we still meet minOrderAmount
  if (cart.couponCode) {
    const subtotal = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
    // Fetch the coupon to get minOrderAmount
    const { Coupon } = await import("../Models/Coupon.model.js");
    const coupon = await Coupon.findOne({ code: cart.couponCode });
    if (coupon && subtotal < coupon.minOrderAmount) {
      cart.couponCode = undefined;
      cart.couponDiscount = 0;
    }
  }

  await cart.save();

  return res.status(200).json(
    new ApiResponse(200, cart, "Item removed from cart successfully")
  );
});

const clearCart = AsyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ customer: req.user._id });
  
  if (cart) {
    cart.items = [];
    cart.couponCode = undefined;
    cart.couponDiscount = 0;
    await cart.save();
  }

  return res.status(200).json(
    new ApiResponse(200, cart || {}, "Cart cleared successfully")
  );
});

const applyCoupon = AsyncHandler(async (req, res) => {
  const { couponCode } = req.body;

  if (!couponCode) {
    throw new ApiError(400, "Coupon code is required");
  }

  const coupon = await Coupon.findOne({ code: couponCode });

  if (!coupon) {
    throw new ApiError(404, "Invalid coupon code");
  }

  if (!coupon.isActive) {
    throw new ApiError(400, "Coupon is inactive");
  }

  const today = new Date();
  if (today < coupon.validFrom || today > coupon.validTo) {
    throw new ApiError(400, "Coupon has expired");
  }

  if (coupon.usedCount >= coupon.maxUses) {
    throw new ApiError(400, "Coupon usage limit reached");
  }

  if (coupon.usedBy.includes(req.user._id)) {
    throw new ApiError(400, "You have already used this coupon");
  }

  let cart = await Cart.findOne({ customer: req.user._id }).populate(
    "items.product",
    "name images isAvailable availableStock pricing taxPercent depositAmount"
  );

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const subtotal = cart.items.reduce((acc, item) => acc + item.subTotal, 0);

  if (subtotal < coupon.minOrderAmount) {
    throw new ApiError(400, `Minimum order amount is ₹${coupon.minOrderAmount}`);
  }

  const { discountAmount } = applyDiscount(subtotal, {
    discountType: coupon.discountType,
    discountValue: coupon.discountValue
  });

  cart.couponCode = coupon.code;
  cart.couponDiscount = discountAmount;
  await cart.save();

  return res.status(200).json(
    new ApiResponse(200, cart, "Coupon applied successfully")
  );
});

const removeCoupon = AsyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ customer: req.user._id }).populate(
    "items.product",
    "name images isAvailable availableStock pricing taxPercent depositAmount"
  );

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.couponCode = undefined;
  cart.couponDiscount = 0;
  await cart.save();

  return res.status(200).json(
    new ApiResponse(200, cart, "Coupon removed successfully")
  );
});

export { getCart, addToCart, updateCartItem, removeCartItem, clearCart, applyCoupon, removeCoupon };