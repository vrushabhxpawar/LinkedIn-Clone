import React from "react";
import { useAuthUser } from "../hooks/useAuthUser.jsx";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import { useParams } from "react-router-dom";
import Post from "../components/Post.jsx";
import Sidebar from "../components/Sidebar.jsx";

function PostPage() {
  const { postId } = useParams();
  const { authUser } = useAuthUser();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/post/${postId}`);
      return res.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser.user} />
      </div>

      <div className="col-span-1 lg:col-span-3">
        <Post post={post} />
      </div>
    </div>
  );
}

export default PostPage;
