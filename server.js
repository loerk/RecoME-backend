import express from "express";
import cors from "cors";
import config from "config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import connectDb from "./helpers/dbConnect.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import bubblesRouter from "./routes/bubblesRouter.js";
import friendsRouter from "./routes/friendsRouter.js";
import recosRouter from "./routes/recosRouter.js";
import settingsRouter from "./routes/settingsRouter.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

const server = express();

// middlewares
server.use(express.json());
server.use(cors({ origin: true, credentials: true }));
server.use(cookieParser());

// Routes
server.use("/auth", authRouter);
server.use("/users", userRouter);
server.use("/bubbles", bubblesRouter);
server.use("/friends", friendsRouter);
server.use("/recos", recosRouter);
server.use("/settings", settingsRouter);
server.use(globalErrorHandler);

// dbConnection
connectDb();
mongoose.connection.on("open", () => {
  console.log("connected to DB");
});
mongoose.connection.on("error", (error) => {
  console.log("connection failed", error.message);
});

const PORT = config.get("app.port");

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
