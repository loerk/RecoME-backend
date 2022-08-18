import mongoose from "mongoose";
const { Schema } = mongoose;
const required = true;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required,
    },
    password: {
      type: String,
      minLength: 4,
      required,
    },
    email: {
      type: String,
      required,
      lowerCase: true,
      validate(value) {
        if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
          throw new Error(`${props.value} is not a valid email`);
      },
    },
    verified: { type: Boolean, default: false },
    emailToken: { type: String, required: true },
    lastLogin: {
      type: Date,
      default: new Date(),
    },
    avatarUrl: String,
    friends: [{ type: String, ref: "User", default: null }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
