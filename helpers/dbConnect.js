import mongoose from "mongoose";

const DB = process.env.REACT_APP_BACKEND_URI;

const connectDb = () => {
  try {
    mongoose.connect(DB);
  } catch (error) {
    console.log("connection failed", error.message);
  }
};

export default connectDb;
