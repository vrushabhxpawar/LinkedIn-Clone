import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../util/cloudinary.config.js";

export const getSuggestedUsers = async (req, res) => {
  try {
    const currUser = await User.findById(req.user._id).select("-password");

    const suggestedUser = await User.find({
      _id: {
        $ne: req.user._id,
        $nin: currUser.connections,
      },
    })
      .select("username fullname profilePic headline")
      .limit(5);

    return res.status(200).json(suggestedUser);
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(401).json({ message: "Username not found" });
    }

    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({ user: user });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "fullname",
      "username",
      "about",
      "headline",
      "profilePic",
      "location",
      "bannerImg",
      "skills",
      "experience",
      "education",
    ];

    const updatedData = {};

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }

    if (req.body.profilePic) {
      const profilePicUrl = await uploadOnCloudinary(req.body.profilePic);
      updatedData.profilePic = profilePicUrl;
    }

    if (req.body.bannerImg) {
      const bannerImgUrl = await uploadOnCloudinary(req.body.bannerImg);
      updatedData.bannerImg = bannerImgUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedData },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: user });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
