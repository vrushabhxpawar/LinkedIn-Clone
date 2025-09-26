import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Image, Loader } from "lucide-react";

function PostCreation({ user }) {
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/post/new", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      resetForm();
      queryClient.invalidateQueries({ queryKey : ["posts"]})
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong");
      resetForm();
    },
  });
  
  const handlePostCreation = async() => {
    try {
      const postData = { content };
      if (image) postData.image = await readFileAsDataURL(image);
      createPostMutation(postData);
    } catch (error) {
      console.error("Error in handlePostCreation", error);
    }
  };

  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }

    setImage(file);

    // Convert file to base64 and update preview
    readFileAsDataURL(file)
      .then((dataUrl) => {
        setImagePreview(dataUrl);
      })
      .catch(() => {
        setImagePreview(null);
      });
  };

  const readFileAsDataURL = async(file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          src={user.profilePic || "/avatar.png"}
          alt={user.fullname}
          className="size-12 rounded-full"
        />
        <textarea
          placeholder="What's in your mind?"
          className="w-full p-3 rounded-lg bg-base-200 hover:bg-base-300 focus:bg-base-300 focus:outline-none
          resize-none transition-colors duration-200 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      {imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Selected"
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          <label className="flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer">
            <Image size={20} className="mr-2" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <button
          className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200"
          onClick={handlePostCreation}
          disabled={isPending}
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Share"}
        </button>
      </div>
    </div>
  );
}

export default PostCreation;
