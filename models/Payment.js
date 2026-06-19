import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    internalRef: { type: String, required: true, unique: true },
    pfPaymentId: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "complete", "cancelled", "failed"],
      default: "pending",
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    service: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentType: { type: String, enum: ["once-off", "installment"], default: "once-off" },
    itnRaw: { type: Object, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
