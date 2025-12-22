import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
};

// Get audit database reference using useDb() — same MongoClient, different database
export const getAuditDb = () => {
  return mongoose.connection.useDb(process.env.MONGODB_AUDIT_DB || "auditLog");
};