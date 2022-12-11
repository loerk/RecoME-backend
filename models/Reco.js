import mongoose from 'mongoose';
const { Schema } = mongoose;
const required = true;
const recoSchema = new Schema(
  {
    categories: {
      type: [String],
      required,
    },
    title: {
      type: String,
      required,
    },
    description: {
      type: String,
      required,
    },
    createdBy: { type: String, ref: 'User', default: null },
    recoUrl: String,
    imageUrl: String,
    userIds: { type: [String], ref: 'User', default: null },
    bubbleId: { type: String, ref: 'Bubble', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Reco', recoSchema);
