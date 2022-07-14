import express from "express";
import cors from "cors";
import config from "config";
import mongoose from "mongoose";

import connectDb from "./helpers/dbConnect.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import bubblesRouter from "./routes/bubblesRouter.js";
import friendsRouter from "./routes/friendsRouter.js";
import recosRouter from "./routes/recosRouter.js";
import settingsRouter from "./routes/settingsRouter.js";
const server = express();

// middlewares
server.use(express.json());
server.use(cors());

// Routes
server.use("/", authRouter);
server.use("/user", userRouter);
server.use("/bubbles", bubblesRouter);
server.use("/friends", friendsRouter);
server.use("/recos", recosRouter);
server.use("/settings", settingsRouter);

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
