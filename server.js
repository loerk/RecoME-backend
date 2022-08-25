import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";
import dbConnect from "./helpers/dbConnect.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import bubbleRouter from "./routes/bubbleRouter.js";
import recoRouter from "./routes/recoRouter.js";
import notificationRouter from "./routes/notificationRouter.js";

import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import requestLogger from "./middlewares/requestLogger.js";

const server = express();

// middlewares
server.use(express.json());
server.use(
  cors({ origin: "https://recomenow.netlify.app", credentials: true })
);
server.use(cookieParser());
server.use(requestLogger);

// Routes
server.use("/auth", authRouter);
server.use("/users", userRouter);
server.use("/bubbles", bubbleRouter);
server.use("/recos", recoRouter);
server.use("/notifications", notificationRouter);

server.use(globalErrorHandler);

// dbConnection
dbConnect();
mongoose.connection.on("open", () => {
  console.log("connected to DB");
});
mongoose.connection.on("error", (error) => {
  console.log("connection failed", error.message);
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
