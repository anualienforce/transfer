import express from "express"
import { postTransfer, } from "../controller/transferController.js"
const router = express.Router()

router.post("/",postTransfer)

export default router
