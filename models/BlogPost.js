import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    content: { type: String, required: true },
    deck: { type: String, required: false, trim: true }, // standfirst, shown under the headline
    excerpt: { type: String, required: false, trim: true },
    category: { type: String, required: false, trim: true },
    tags: [{ type: String, trim: true }],
    videoUrl: { type: String, required: false, trim: true },
    author: { type: String, required: false },
    image: { type: String, required: false },
    imagePublicId: { type: String, required: false },
    coverAlt: { type: String, required: false, trim: true },
    coverCaption: { type: String, required: false, trim: true },
    coverCredit: { type: String, required: false, trim: true },
    // object-position preset for the cover image — lets a photo with
    // baked-in text or an off-center subject (e.g. the altar post's
    // "ALTAR FOR!" thumbnail text) avoid being cropped by object-cover.
    coverFocus: {
      type: String,
      enum: ["center", "top", "bottom", "left", "right"],
      default: "center",
    },
    videoOrientation: {
      type: String,
      enum: ["landscape", "portrait"],
      default: "landscape",
    },
    authorBio: { type: String, required: false, trim: true },
    authorAvatar: { type: String, required: false, trim: true },
    featured: { type: Boolean, default: false },
    takeaways: [{ type: String, trim: true }],
    ctaVariant: {
      type: String,
      enum: ["audit", "whatsapp", "newsletter", "none"],
      default: "audit",
    },
    metaTitle: { type: String, required: false, trim: true },
    metaDescription: { type: String, required: false, trim: true },
    keywords: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

blogPostSchema.index({ createdAt: -1 });

export default mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);
