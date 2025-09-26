import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authUser = async(req, res, next) => {
  try {
    let token = req.cookies.token;
    if(!token) {
      return res.status(404).json({ message : "Unauthorized access"})
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if(!decodedToken){
      return res.status(401).json({ message : "Invalid token"})
    }

    const userId = await decodedToken.userId;
    const currUser = await User.findById(userId).select("-password");

    if(!currUser) {
      return res.status(404).json({ message : "User does not exists"});
    }

    req.user = currUser;
    next();
  } catch (error) {
    console.log(error)
    console.log(error.message)
    return res.status(500).json({ message : error.message })
  }
}