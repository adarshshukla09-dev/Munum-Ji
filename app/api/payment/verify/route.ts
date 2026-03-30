import Stripe from "stripe";
import { NextResponse } from "next/server";
import { saveDebtToDetails } from "@/server-actions/payment";
import { addNotification } from "@/server-actions/notifications";
import { db } from "@/db";
import { paymentLP } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ success: false, message: "Session ID missing" });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json({ success: false, message: "Payment not completed" });
  }

  const type = session.metadata?.type;

  // ✅ CASE 1: Ledger payment
  if (type === "ledger") {
    const customerId = session.metadata?.customerId;
    const amount = session.amount_total! / 100;

    if (!customerId) {
      return NextResponse.json({ success: false, message: "Invalid ledger metadata" });
    }

    await saveDebtToDetails({ customerId, amount });

    const customer = await db.query.customer.findFirst({
      where: (c, { eq }) => eq(c.id, customerId),
    });

    if (customer) {
      await addNotification({
        name: customer.name,
        type: "payment",
        message: `Payment received from ${customer.name}`,
      });
    }

    return NextResponse.json({ success: true });
  }

  // ✅ CASE 2: Direct purchase
  if (type === "direct") {
    const paymentId = session.metadata?.paymentId;

    if (!paymentId) {
      return NextResponse.json({ success: false, message: "Invalid direct metadata" });
    }

    // ✅ Mark payment as completed
    await db.update(paymentLP)
      .set({ status: "success" })
      .where(eq(paymentLP.id, paymentId));

    await addNotification({
      name: "Walk-in Customer",
      type: "payment",
      message: `Direct payment received`,
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: "Unknown payment type" });
}