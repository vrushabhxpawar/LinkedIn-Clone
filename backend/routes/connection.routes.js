import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { 
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getConnectionRequest,
    getAllConnections,
    removeConnection,
    getConnectionStatus
   } from "../controllers/connection.controllers.js";

const router = Router();

router
  .route("/request/:userId")
  .post(authUser, sendConnectionRequest)


router
  .route("/accept/:requestId")
  .put(authUser, acceptConnectionRequest)

router
  .route("/reject/:requestId")
  .put(authUser, rejectConnectionRequest)

router
  .route("/requests")
  .get(authUser, getConnectionRequest)

router
  .route("/")
  .get(authUser, getAllConnections)

router
  .route("/:userId")
  .put(authUser, removeConnection)

router
  .route("/status/:userId")
  .get(authUser, getConnectionStatus)

export default router;