import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    displayTitle: { type: String, required: false, trim: true, default: null },
    category: {
      type: String,
      enum: ["general", "bundle"],
      default: "general",
      index: true,
    },
    description: { type: String, required: true },
    icon: { type: String, required: false },
    image: { type: String, required: false },
    imagePublicId: { type: String, required: false },
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, createdAt: -1 });

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);
