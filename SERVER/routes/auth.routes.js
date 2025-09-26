import { Router } from "express";
import {
  login,
  signup,
  logout,
  getMe,
} from "../controllers/auth.controllers.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(login);

router.route("/signup").post(signup);

router.route("/logout").post(authUser, logout);

router.route("/me").get(authUser, getMe);

export default router;
