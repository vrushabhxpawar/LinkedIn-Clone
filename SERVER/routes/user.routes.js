import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {
  getSuggestedUsers,
  getPublicProfile,
  updateProfile
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/suggestions").get(authUser, getSuggestedUsers);

router.route("/:username").get(authUser, getPublicProfile);

router.route("/updateProfile").put(authUser, updateProfile);

export default router;
