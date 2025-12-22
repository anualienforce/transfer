
import mongoose from "mongoose";
import { getAuditDb } from "../config/db.js";

const auditSchema = new mongoose.Schema(
    {
        senderEmail: {
            type: String,
            required: true,
        },
        receiverEmail: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["SUCCESS", "FAILED"],
            default: "SUCCESS",
        },
        reason: {
            type: String,
            default: null,
        },
    },
    { timestamps: true, collection: "audits" }
);

// Bind to audit database via useDb() — same MongoClient, separate database
const Audit = getAuditDb().model("Audit", auditSchema);

export default Audit;