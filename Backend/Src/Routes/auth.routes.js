import { Router } from "express";
import { forgotPassword, loginUser, logoutUser, refreshAccessToken, registerUser, resendOTP, resetPassword, verifyOTP } from "../Controllers/auth.controller.js";
import verifyJWT from "../Middleware/Auth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";
const router=Router();

router.route("/register").post(upload.fields([
    ]),registerUser)
router.route("/verify-otp").post(verifyOTP)
router.route("/resend-otp").post(resendOTP)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password").post(resetPassword)
router.route("/refresh-token").post(refreshAccessToken)

export default router