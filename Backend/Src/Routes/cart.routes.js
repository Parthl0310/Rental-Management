
import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon
} from "../Controllers/cart.controller.js";
import verifyJWT from "../Middleware/Auth.middleware.js";
import { isCustomer } from "../Middleware/role.middleware.js";

const router = express.Router();

router.use(verifyJWT, isCustomer);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/item/:productId", updateCartItem);
router.delete("/item/:productId", removeCartItem);
router.delete("/clear", clearCart);
router.post("/apply-coupon", applyCoupon);
router.delete("/remove-coupon", removeCoupon);

export default router;
