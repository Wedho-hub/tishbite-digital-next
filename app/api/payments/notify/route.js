import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
import { isValidPayFastIP, verifyItnWithPayFast } from "@/lib/payfast";

// PayFast ITN (Instant Transaction Notification) — server-to-server POST.
export async function POST(request) {
  try {
    const formData = await request.formData();
    const itnData = Object.fromEntries(formData.entries());

    if (process.env.NODE_ENV === "production" && !isValidPayFastIP(request.headers)) {
      console.warn("[PayFast ITN] Invalid source IP");
      return new Response("Invalid IP", { status: 400 });
    }

    const isValid = await verifyItnWithPayFast(itnData);
    if (!isValid) {
      console.warn("[PayFast ITN] Failed PayFast server validation");
      return new Response("Invalid ITN", { status: 400 });
    }

    const statusMap = {
      COMPLETE: "complete",
      FAILED: "failed",
      PENDING: "pending",
      CANCELLED: "cancelled",
    };
    const newStatus = statusMap[itnData.payment_status] || "failed";

    await connectDB();
    await Payment.findOneAndUpdate(
      { internalRef: itnData.m_payment_id },
      { status: newStatus, pfPaymentId: itnData.pf_payment_id, itnRaw: itnData }
    );

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[PayFast ITN] Error:", err);
    return new Response("Server error", { status: 500 });
  }
}
