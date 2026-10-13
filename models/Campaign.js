import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true }, // Markdown, rendered the same way as blog posts
    recipientCount: { type: Number, required: true, default: 0 },
    failedCount: { type: Number, required: true, default: 0 },
    sentAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

campaignSchema.index({ createdAt: -1 });

export default mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
