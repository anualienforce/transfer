import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Dedicated connection for audit database; default connection serves the main app DB
export const auditConnection = mongoose.createConnection(process.env.MONGODB_AUDIT_URI);

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await auditConnection.asPromise();
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
};