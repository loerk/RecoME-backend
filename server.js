import express from "express";
import cors from "cors";
import config from "config";
import mongoose from "mongoose";

import connectDb from "./helpers/dbConnect.js";
import router from "./routes/router.js";
const server = express();

server.use(express.json());
server.use(cors());

server.use("/", router);
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
