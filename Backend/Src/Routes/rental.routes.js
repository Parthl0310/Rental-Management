import {Router} from "express"
import verifyJWT from "../Middleware/Auth.middleware.js";
import { isAdmin, isCustomer } from "../Middleware/role.middleware.js";
import { cancelOrder, confirmRentalOrder, createRentalOrder, duplicateOrder, getAllOrders, getMyOrders, getSingleOrder, sendQuotation, updateOrderStatus } from "../Controllers/rental.controller.js";

const router=Router();

router.route("/").get(verifyJWT,isAdmin,getAllOrders);
router.route("/my-orders").get(verifyJWT,isCustomer,getMyOrders);
router.route("/:orderId").get(verifyJWT,getSingleOrder);
router.route("/").post(verifyJWT,isCustomer,createRentalOrder);
router.route("/:orderId/send-quotation").put(verifyJWT,isAdmin,sendQuotation);
router.route("/:orderId/confirm").put(verifyJWT,isAdmin,confirmRentalOrder);
router.route("/:orderId/status").put(verifyJWT,isAdmin,updateOrderStatus);
router.route("/:orderId/cancel").put(verifyJWT,cancelOrder);
router.route("/:orderId/duplicate").put(verifyJWT,isAdmin,duplicateOrder);

export default router;