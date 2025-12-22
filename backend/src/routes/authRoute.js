import express from "express"
import { getLogin, getSignUp, getMe } from "../controller/authController.js"
import requireAuth from "../middleware/authMiddleware.js";
const router = express.Router()

router.post("/login/", getLogin)
router.post("/signup/", getSignUp)
router.get("/me", requireAuth, getMe)

export default router
