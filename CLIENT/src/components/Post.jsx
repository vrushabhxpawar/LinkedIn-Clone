import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  Loader,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { axiosInstance } from "../lib/axios.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast, { useToasterStore } from "react-hot-toast";
import { useAuthUser } from "../hooks/useAuthUser.jsx";
import { formatDistanceToNow } from "date-fns";
import PostAction from "./PostAction.jsx";

function Post({ post }) {
  const queryClient = useQueryClient();

  const { authUser } = useAuthUser();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const isOwner = authUser.user._id === post.author._id;
  const isLiked = post.likes.includes(authUser.user._id);

  const { mutate: deletePostMutation, isPending: isDeletingPost } = useMutation(
    {
      mutationFn: async () => {
        const res = await axiosInstance.delete(`/post/${post._id}/delete`);
        return res.data;
      },
      onSuccess: () => {
        toast.success("Post deleted");
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
      onError: (err) => {
        toast.error(err.response.data.message || "Failed to add post");
      },
    }
  );

  const { mutate: createCommentMutation, isLoading: isAddingComment } =
    useMutation({
      mutationFn: async (newComment) => {
        const res = await axiosInstance.post(`/post/${post._id}/comment`, {
          content: newComment,
        });
        return res.data;
      },
      onSuccess: () => {
        toast.success("Commented on post");
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey : ['post']})
      },
      onError: (err) => {
        toast.error(err.response.data.message || "Failed to add comment");
      },
    });

  const { mutate: likePostMutation, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.put(`/post/${post._id}/like`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
       queryClient.invalidateQueries({ queryKey : ['post']})
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to like post");
    },
  });

  const handleLikePost = async () => {
    if (isLikingPost) return;
    likePostMutation();
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure u want to delete this post?")) return;
    deletePostMutation();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createCommentMutation(newComment);
    }
    setNewComment("");
    setComments([
      ...comments,
      {
        content: newComment,
        author: {
          _id: authUser.user._id,
          fullname: authUser.user.fullname,
          profilePic: authUser.user.profilePic,
        },
        createdAt: Date.now(),
      },
    ]);
  };
  return (
    <div className="rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to={`/profile/${post?.author?.username}`}>
              <img
                src={post.author.profilePic || "/avatar.png"}
                alt={post.author.fullname}
                className="size-10 rounded-full mr-3"
              />
            </Link>

            <div>
              <Link to={`/profile/${post?.author?.username}`}>
                <h3 className="font-semibold">{post.author.fullname}</h3>
              </Link>
              <p className="text-xs text-info">{post.author.headline}</p>
              <p className="text-xs text-info">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700"
            >
              {isDeletingPost ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg w-full mb-4"
          />
        )}

        <div className="flex justify-between text-info">
          <PostAction
            icon={
              <ThumbsUp
                size={18}
                className={isLiked ? "text-blue-500  fill-blue-300" : ""}
              />
            }
            text={`Like (${post.likes.length})`}
            onClick={handleLikePost}
          />

          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment (${comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />
          <PostAction icon={<Share2 size={18} />} text="Share" />
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="mb-2 bg-base-100 p-2 rounded flex items-start"
              >
                <img
                  src={comment.author.profilePic || "/avatar.png"}
                  alt={comment.author.fullname}
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold mr-2">
                      {comment.author.fullname}
                    </span>
                    <span className="text-xs text-info">
                      {formatDistanceToNow(new Date(comment.createdAt))}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 rounded-l-full bg-base-300 focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />

            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300"
              disabled={isAddingComment}
            >
              {isAddingComment ? (
                <Loader size={24} className="animate-spin" />
              ) : (
                <Send size={24} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Post;
