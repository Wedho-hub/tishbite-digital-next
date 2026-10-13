import crypto from "crypto";
import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    whatsapp: { type: String, required: false, trim: true },
    need: { type: String, required: false, trim: true },
    source: { type: String, required: false, trim: true }, // offer slug: audit, scorecard, pricing-guide, checklist, call
    utmSource: { type: String, required: false, trim: true },
    utmMedium: { type: String, required: false, trim: true },
    utmCampaign: { type: String, required: false, trim: true },
    utmContent: { type: String, required: false, trim: true },
    status: { type: String, enum: ["subscribed", "unsubscribed"], default: "subscribed", index: true },
    unsubscribeToken: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(24).toString("hex"),
    },
  },
  { timestamps: true }
);

// One record per email — re-subscribing (or signing up for a second offer)
// updates the existing document instead of creating a duplicate.
subscriberSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);
