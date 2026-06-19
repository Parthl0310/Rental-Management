import { Router } from "express";
import verifyJWT from "../Middleware/Auth.middleware.js";
import { isAdmin } from "../Middleware/role.middleware.js";
import { getAllTransfers, getSingleTransfer, getTransfersByOrder, updateTransferStatus } from "../Controllers/transfer.controller.js";

const router=Router();

router.route("/").get(verifyJWT,isAdmin,getAllTransfers)
router.route("/:transferId").get(verifyJWT,isAdmin,getSingleTransfer)
router.route("/:transferId/status").put(verifyJWT,isAdmin,updateTransferStatus)
router.route("/order/:orderId").get(verifyJWT,isAdmin,getTransfersByOrder)

export default router;