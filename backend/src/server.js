import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";


import authRoute from "./routes/authRoute.js"
import transferRoute from "./routes/transferRoute.js"
import auditRoute from "./routes/auditRoute.js"
import requireAuth from "./middleware/authMiddleware.js";
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5001;


//middleware
app.use(cors({
    origin:"http://localhost:5173"
}))
app.use(express.json())
app.use(rateLimiter)

//checking middleware
// app.use((req,res,next) => {
//     console.log(`${req.method} request for ${req.url} from middleware`)
//     next();
// })

app.use("/api/auth", authRoute)
app.use("/api/transfer", requireAuth, transferRoute)
app.use("/api/audit", requireAuth, auditRoute)

// app.get("/api/auth/login", (req,res)=>{
//     res.status(200).send("Login sucessfully")
// })

// app.get("/api/auth/signup", (req,res)=>{
//     res.status(200).send("SignUp sucessfully")
// })





connectDB().then(()=>{
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
})