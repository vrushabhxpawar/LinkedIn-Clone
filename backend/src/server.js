import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "../db/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.listen(PORT, async () => {
  await connectDB();
  console.log(`SERVER : http://localhost:${PORT}`);
});

import authRouter from "../routes/auth.routes.js";
import userRouter from "../routes/user.routes.js";
import postRouter from "../routes/post.routes.js";
import notificationRouter from "../routes/notification.routes.js";
import connectionRouter from "../routes/connection.routes.js";

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
  });
}

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/post", postRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/connection", connectionRouter);
