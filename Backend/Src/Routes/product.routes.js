import { Router } from "express";
import { calculatePrice, createProduct, deleteProduct, getAllProducts, getProductAvailability, getSingleProduct, updateProduct, updateStock } from "../Controllers/product.controller.js";
import verifyJWT from "../Middleware/Auth.middleware.js";
import { isAdmin } from "../Middleware/role.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";

const router=Router();

router.route("/").get(getAllProducts);
router.route("/:id").get(getSingleProduct)
router.route("/:id/availability").get(getProductAvailability)
router.route("/calculate-price").post(verifyJWT,calculatePrice)
router.route("/").post(verifyJWT,isAdmin,upload.array("images", 5),createProduct)
router.route("/:id").put(verifyJWT,isAdmin,upload.array("images", 5),updateProduct);
router.route("/:id").delete(verifyJWT,isAdmin,deleteProduct);
router.route("/:id/update-stock").post(verifyJWT,isAdmin,updateStock)

export default router