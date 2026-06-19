import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: false },
    imagePublicId: { type: String, required: false },
    link: { type: String, required: false },
  },
  { timestamps: true }
);

projectSchema.index({ createdAt: -1 });

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
