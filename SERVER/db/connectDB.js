import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
  path : "./.env"
})

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`Connected to DB : ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
    console.log("Error connecting to MongoDB",error.message);
    process.exit(1);
  }
};
