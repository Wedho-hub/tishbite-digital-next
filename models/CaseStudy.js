import mongoose from "mongoose";

const caseStudySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    industry: { type: String, required: false, trim: true },
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
    result: { type: String, required: true },
    metrics: [{ type: String, trim: true }],
    link: { type: String, required: false },
    image: { type: String, required: false },
    imagePublicId: { type: String, required: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

caseStudySchema.index({ order: 1, createdAt: -1 });

export default mongoose.models.CaseStudy || mongoose.model("CaseStudy", caseStudySchema);
