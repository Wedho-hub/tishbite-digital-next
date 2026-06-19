import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: String, required: false },
    image: { type: String, required: false },
    imagePublicId: { type: String, required: false },
    metaTitle: { type: String, required: false, trim: true },
    metaDescription: { type: String, required: false, trim: true },
    keywords: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

blogPostSchema.index({ createdAt: -1 });

export default mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);
