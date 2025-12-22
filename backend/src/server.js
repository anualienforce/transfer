import express from 'express';
import authRoute from "./routes/authRoute.js"
import transferRoute from "./routes/transferRoute.js"
import auditRoute from "./routes/auditRoute.js"
import { connectDB } from './config/db.js';
import dotenv from "dotenv";
import rateLimiter from './middleware/rateLimiter.js';


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5001;

connectDB()

//middleware
app.use(express.json())//this will parse the JSON bodies: req.body

app.use(rateLimiter)

//TODO : create a middleware for auth to access the dab so user will not access without login

// app.use((req,res,next) => {
//     console.log(`${req.method} request for ${req.url} from middleware`)
//     next();
// })

app.use("/api/auth", authRoute)
app.use("/api/transfer", transferRoute)
app.use("/api/audit", auditRoute)

// app.get("/api/auth/login", (req,res)=>{
//     res.status(200).send("Login sucessfully")
// })

// app.get("/api/auth/signup", (req,res)=>{
//     res.status(200).send("SignUp sucessfully")
// })



app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
