import Audit from "../models/Audit.js";

export const getAudit = async (req, res) => {
  try {
    const senderEmail = req.user.email;
    if (!senderEmail) {
      return res.status(400).json({
        success: false,
        message: "User email not found in token",
      });
    }

    const audits = await Audit.find({ senderEmail });
    if (!audits || audits.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No audits found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Audits retrieved successfully",
      audits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Audit retrieval failed",
      error: error.message,
    });
  }
};