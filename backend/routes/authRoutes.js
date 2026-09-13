import express from "express"
const router = express.Router()

import { registerUser, loginUser, getProfile } from "../controllers/authController.js"
import { resendOtp, verifyOtp } from "../controllers/otpController.js"
import { forgotPassword, changePassword } from "../controllers/forgotPassword.js"
import authMiddleware from "../middlewares/auth.js"

router.route("/signup").post(registerUser)
router.route("/login").post(loginUser)
router.route("/verify-otp").post(verifyOtp)
router.route("/resend-otp").post(resendOtp)
router.route("/forgot-password").post(forgotPassword)
router.route("/change-password").post(changePassword)
router.route("/get-profile").get(authMiddleware, getProfile)

export default router