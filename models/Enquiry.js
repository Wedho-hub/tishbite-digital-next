import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);
