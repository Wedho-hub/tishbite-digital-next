import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema(
  {
    // 1. Contact & Business Basics
    fullName: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    businessDescription: { type: String, trim: true },
    yearsOperating: { type: String, trim: true },

    // 2. Current Digital Presence
    hasWebsite: { type: String, enum: ["yes", "no"], default: "no" },
    websiteUrl: { type: String, trim: true },
    whatsWorking: { type: String, trim: true },
    whatsNotWorking: { type: String, trim: true },
    marketingChannels: [{ type: String, trim: true }],
    hasGoogleBusinessProfile: { type: String, enum: ["yes", "no", "not_sure"], default: "not_sure" },

    // 3. Goals & Project Scope
    goals: [{ type: String, trim: true }],
    servicesInterested: [{ type: String, trim: true }],
    successDefinition: { type: String, trim: true },
    timeline: { type: String, trim: true },
    urgencyReason: { type: String, trim: true },

    // 4. Target Audience & Competitors
    idealCustomer: { type: String, trim: true },
    customerLocations: { type: String, trim: true },
    competitors: { type: String, trim: true },
    competitorLikesDislikes: { type: String, trim: true },

    // 5. Brand & Content Assets
    hasLogo: { type: String, enum: ["yes", "no"], default: "no" },
    hasBrandColors: { type: String, enum: ["yes", "no"], default: "no" },
    hasMedia: { type: String, enum: ["yes", "no", "some"], default: "no" },
    hasCopyReady: { type: String, enum: ["yes", "no"], default: "no" },

    // 6. Budget & Decision Process
    budgetRange: { type: String, trim: true },
    openToInstallments: { type: String, enum: ["yes", "no", "maybe"], default: "maybe" },
    decisionMakers: { type: String, trim: true },

    // 7. Anything else
    additionalNotes: { type: String, trim: true },

    // Admin triage
    status: { type: String, enum: ["new", "reviewed", "quoted"], default: "new" },
  },
  { timestamps: true }
);

onboardingSchema.index({ createdAt: -1 });
onboardingSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Onboarding || mongoose.model("Onboarding", onboardingSchema);
