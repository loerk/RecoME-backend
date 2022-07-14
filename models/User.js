import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
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
    verified: { type: Boolean, default: false },
    emailToken: { type: String, required: true },
    id: String,
    lastLogin: {
      type: Date,
      default: new Date(),
    },
    avatarUrl: String,
    friends: [String],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
