import { v2 as cloudindary } from "cloudinary";

cloudindary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (url) => {
  const result = await cloudindary.uploader.upload(url);
  return result.secure_url;
};

export const deleteFromCloudinary = async (url) => {
  try {
    const result = await cloudindary.uploader.destroy(url);
    console.log("Image deleted successfully");
  } catch (error) {
    console.log(error);
    console.log(error.message);
  }
};
