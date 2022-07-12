import mongoose from "mongoose";
import config from "config";

const DB = config.get("db.uri");

const connectDb = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log("connection failed", error.message);
  }
};

export default connectDb;
