import mongoose from "mongoose";
import config from "config";

const DB = config.get("db.uri");

const connectDb = () => {
  try {
    mongoose.connect(DB);
  } catch (error) {
    console.log("connection failed", error.message);
  }
};

export default connectDb;
