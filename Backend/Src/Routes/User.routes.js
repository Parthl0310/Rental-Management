import { Router } from "express";
import { getCurrentUser } from "../Controllers/User.controller.js";
import verifyJWT from "../Middleware/Auth.middleware.js";

const router=Router();

router.route('/me').get(verifyJWT,getCurrentUser)

export default router