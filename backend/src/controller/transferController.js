import mongoose, { mongo } from "mongoose";
import User from "../models/User.js";
import Audit from "../models/Audit.js";

export const postTransfer = async (req, res)=>{
    const { senderEmail, receiverEmail, amount } = req.body;
    const session  = await mongoose.startSession()
  try {
    session.startTransaction()
    const sender = await User.findOne({email: senderEmail}, null, {session});

    const receiver = await User.findOne({email: receiverEmail}, null, {session});

    if(!sender || !receiver){
        throw new Error("Sender or Receiver not found")
    }

    if(sender.balance < amount){
        throw new Error("Insufficient balance")
    }
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({session});
    await receiver.save({session}); 

    //added audit in transaction so if audit gets failed whole transaction will be aborted or vice versa
    await Audit.create([{ senderEmail, receiverEmail, amount, status: "SUCCESS" }], { session });
    
    await session.commitTransaction()
    
    res.status(200).json({
        success: true,
        message: "Transfer successful",
    });
   
  } catch (error) {
    await session.abortTransaction()
    await Audit.create(
      { senderEmail, receiverEmail, amount, status: "FAILED", reason: error.message });
    res.status(500).json({
        success: false,
        message: "Transfer failed",
        error: error.message,
    });
  }finally{
    session.endSession()
  }
}