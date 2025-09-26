import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  sender : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
   recipient : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  status : {
    type : String,
    enum : ["accepted", "pending", "rejected"],
    default : "pending"
  }
}, { timestamps : true })

export const Connection = mongoose.model("Connection", connectionSchema)