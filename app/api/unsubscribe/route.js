import connectDB from "@/lib/db";
import Subscriber from "@/models/Subscriber";

export async function POST(request) {
  try {
    const { token } = await request.json();
    if (!token) return Response.json({ error: "Missing token." }, { status: 400 });

    await connectDB();
    const subscriber = await Subscriber.findOneAndUpdate(
      { unsubscribeToken: token },
      { $set: { status: "unsubscribed" } },
      { new: true }
    );

    if (!subscriber) return Response.json({ error: "Invalid or expired unsubscribe link." }, { status: 404 });

    return Response.json({ success: true, email: subscriber.email });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
