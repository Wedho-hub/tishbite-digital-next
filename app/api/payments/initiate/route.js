import crypto from "crypto";
import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
import { generateSignature, PAYFAST_URL } from "@/lib/payfast";

const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
const PASSPHRASE = process.env.PAYFAST_PASSPHRASE || null;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tishbitedigital.co.za";

export async function POST(request) {
  try {
    await connectDB();
    const { firstName, lastName, email, phone, service, amount, paymentType } = await request.json();

    if (!firstName || !lastName || !email || !service || !amount) {
      return Response.json({ message: "Missing required fields." }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return Response.json({ message: "Invalid payment amount." }, { status: 400 });
    }

    const internalRef = crypto.randomBytes(12).toString("hex");

    await Payment.create({
      internalRef,
      firstName,
      lastName,
      email,
      phone: phone || "",
      service,
      amount: parsedAmount,
      paymentType: paymentType || "once-off",
      status: "pending",
    });

    const pfData = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: `${SITE_URL}/payment/success?ref=${internalRef}`,
      cancel_url: `${SITE_URL}/payment/cancel?ref=${internalRef}`,
      notify_url: `${SITE_URL}/api/payments/notify`,
      name_first: firstName,
      name_last: lastName,
      email_address: email,
      ...(phone && { cell_number: phone }),
      m_payment_id: internalRef,
      amount: parsedAmount.toFixed(2),
      item_name: service,
      item_description: `${paymentType === "installment" ? "Installment payment" : "Once-off payment"} for ${service}`,
    };

    pfData.signature = generateSignature(pfData, PASSPHRASE);

    return Response.json({ pfUrl: PAYFAST_URL, params: pfData });
  } catch (err) {
    console.error("[payments/initiate] error", err);
    return Response.json({ message: "Failed to initiate payment." }, { status: 500 });
  }
}
