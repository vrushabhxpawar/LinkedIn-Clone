import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../util/email.js";

const options = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
};

const generateToken = async (userId) => {
  try {
    if (!userId) {
      return res.status(404).json({ message: "Userid not found" });
    }

    const token = jwt.sign({ userId } , process.env.JWT_SECRET, {
      expiresIn: "7D",
    });

    return token;
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = await generateToken(user._id);
    const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;
    try {
      await sendWelcomeEmail(user.email, user.fullname, profileUrl);
    } catch (error) {
      console.log("error in sending email", error);
      console.log(error.message);
    }

    return res
      .status(201)
      .cookie("token", token, options)
      .json({ message: "User registered successfully", User: user });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User not registered" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await generateToken(existingUser._id);

    return res
      .status(200)
      .cookie("token", token, options)
      .json({ message: "User logged-In successfully", User: existingUser });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successfull" });
};

export const getMe = async(req, res) => {
  try {
    const user = req.user;
    if(!user) {
      return res.status(404).json({ message : "User does not exists"})
    }

    return res
            .status(200)
            .json({ message : "User fetched successfully", user : user })
  } catch (error) {
    console.log(error);
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}