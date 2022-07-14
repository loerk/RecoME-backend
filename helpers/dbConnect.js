import mongoose from "mongoose";
import config from "config";

const DB = config.get("db.uri");

const connectDb = () => {
  try {
    mongoose.connect(DB);
  } catch (err) {
    console.log("connection failed", err.message);
  }
};

export default connectDb;
