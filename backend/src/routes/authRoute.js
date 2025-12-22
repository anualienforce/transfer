import express from "express"
import { getLogin, getSignUp } from "../controller/authController.js"
const router = express.Router()

router.post("/login/", getLogin)

router.post("/signup/", getSignUp)

export default router
