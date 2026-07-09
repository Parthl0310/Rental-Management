import express from "express";
import {
  getWishlist,
  toggleWishlist,
  checkWishlist,
} from "../Controllers/wishlist.controller.js";
import verifyJWT from "../Middleware/Auth.middleware.js";
import { isCustomer } from "../Middleware/role.middleware.js";

const router = express.Router();

router.use(verifyJWT, isCustomer);

router.get("/", getWishlist);
router.post("/toggle/:productId", toggleWishlist);
router.get("/check/:productId", checkWishlist);

export default router;
