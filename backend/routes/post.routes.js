import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {
  createPost,
  deletePost,
  getFeed,
  getPostById,
  createComment,
  likePost,
} from "../controllers/post.controllers.js";

const router = Router();

router.route("/").get(authUser, getFeed);

router.route("/new").post(authUser, createPost);

router.route("/:postId/delete").delete(authUser, deletePost);

router.route("/:postId").get(authUser, getPostById);

router.route("/:postId/comment").post(authUser, createComment);

router.route("/:postId/like").put(authUser, likePost);

export default router;
