
import mongoose from "mongoose";

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

// Use default connection for atomicity with User transactions
const Audit = mongoose.model("Audit", auditSchema);

export default Audit;