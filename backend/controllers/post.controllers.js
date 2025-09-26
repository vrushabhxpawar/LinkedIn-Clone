import { Post } from "../models/post.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../util/cloudinary.config.js";
import { Notification } from "../models/notification.model.js";
import { sendcommentNotificationEmail } from "../util/email.js";

export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find({
      author: { $in: [...req.user.connections, req.user._id ] },
    })
      .populate("author", "fullname username profilePic headline")
      .populate("comments.author", "fullname profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    let newPost;
    if (image) {
      const imageUrl = await uploadOnCloudinary(image);
      newPost = new Post({
        author: req.user._id,
        image: imageUrl,
        content,
      });
    } else {
      newPost = new Post({
        author: req.user._id,
        content,
      });
    }

    await newPost.save();

    return res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate("author", "_id");

    if (!post) {
      return res.status(401).json({ message: "Post not found" });
    }

    if (post.author._id.toString() == req.user._id.toString()) {
      if (post.image) {
        await deleteFromCloudinary(post.image.split("/").pop().split(".")[0]);
      }
      await Post.findByIdAndDelete(postId);
    } else {
      return res
        .status(401)
        .json({ message: "You're not the author of the post" });
    }

    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("author", "fullname username profilePic headline")
      .populate("comments.author", "fullname username profilePic");
    if (!post) {
      return res.status(401).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    let post = await Post.findById(postId);
    if (!post) {
      return res.status(401).json({ message: "Post not found" });
    }

    post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { author: req.user._id, content } } },
      { new: true }
    ).populate("author", "fullname username email profilePic headline");

    if (post.author._id.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        recipient: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: postId,
      });

      await notification.save();

      try {
        const postUrl = process.env.CLIENT_URL + "/post/" + postId;
        await sendcommentNotificationEmail(
          post.author.email,
          post.author.fullname,
          req.user.fullname,
          postUrl,
          content
        );
      } catch (error) {
        console.log(error);
      }

      return res.status(200).json(notification);
    }
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    let post = await Post.findById(postId);

    if (!post) {
      return res.status(401).json({ message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      // unlike post
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // like post
      post.likes.push(userId);
      try {
        if (post.author._id.toString() !== req.user._id.toString()) {
          const notification = new Notification({
            recipient: post.author,
            type: "like",
            relatedUser: userId,
            relatedPost: postId,
          });
          await notification.save();
        }
      } catch (error) {
        console.log("Error in likePost controller", error);
      }
    }

    await post.save();

    return res.status(200).json({ message: "Post Liked" });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
