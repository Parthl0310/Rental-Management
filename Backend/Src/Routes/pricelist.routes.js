import { Router } from "express";
import {createPricelist,getAllPricelists,getActivePricelists,updatePricelist,deletePricelist} from "../Controllers/pricelist.controller.js"
import verifyJWT from '../Middleware/Auth.middleware.js'
import {isAdmin} from "../Middleware/role.middleware.js"

const router=Router();  

router.route("/active").get(getActivePricelists);
router.route("/").get(verifyJWT,isAdmin,getAllPricelists);
router.route("/").post(verifyJWT,isAdmin,createPricelist);
router.route("/:id").put(verifyJWT,isAdmin,updatePricelist);
router.route("/:id").delete(verifyJWT,isAdmin,deletePricelist);

export default router;

