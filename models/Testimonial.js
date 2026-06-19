import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: false, trim: true },
    company: { type: String, required: false, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    quote: { type: String, required: true },
    image: { type: String, required: false },
    imagePublicId: { type: String, required: false },
    source: { type: String, default: "Google" },
  },
  { timestamps: true }
);

testimonialSchema.index({ createdAt: -1 });

export default mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
