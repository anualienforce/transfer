
import ratelimiter from "../config/upstash.js"


export const rateLimiter = async (req, res, next)=> {
    console.log(req.ip)
    try {
        const {success} = await ratelimiter.limit(req.ip)
        if(!success){
            return res.status(429).json({
                success: false,
                message: "Too many requests, please try again later."
            })
        }
        next();
    } catch (error) {
        console.log("Rate limiter error:", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error in rate limiter"
        })
        next(error);
    }
}

export default rateLimiter