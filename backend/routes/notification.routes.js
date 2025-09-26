import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notification.controllers.js";

const router = Router();

router.route("/").get(authUser, getNotifications);

router.route("/:id/read").put(authUser, markNotificationAsRead);

router.route("/:id/delete").delete(authUser, deleteNotification);

export default router;
