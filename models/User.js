import mongoose from "mongoose";
const { Schema, model } = mongoose;
const profileSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minLength: 4,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowerCase: true,
    validate(value) {
      if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
        throw new Error(`${props.value} is not a valid email`);
    },
  },
});
const userSchema = new Schema(
  {
    profile: {
      type: profileSchema,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: new Date(),
    },
    avatarUrl: String,
    friends: [String],
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
