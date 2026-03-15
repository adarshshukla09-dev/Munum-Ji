import Stripe from "stripe";
import { NextResponse } from "next/server";
import { saveDebtToDetails } from "@/server-actions/payment";
import { addNotification } from "@/server-actions/notifications";
import { db } from "@/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({
      success: false,
      message: "Session ID missing",
    });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json({
      success: false,
      message: "Payment not completed",
    });
  }

  const customerId = session.metadata?.customerId;
  const amount = session.amount_total! / 100;

  if (!customerId || !amount) {
    return NextResponse.json({
      success: false,
      message: "Invalid metadata",
    });
  }

  await saveDebtToDetails({
    customerId,
    amount,
  });
 

    const customer = await db.query.customer.findFirst({
      where: (c, { eq }) => eq(c.id, customerId),
    });

    if (!customer) {
      return;
    }

    const newNoti = await addNotification({
      name: customer.name,
      type: "payment",
      message: `Payment received from ${customer.name}`,
    });

    return newNoti;


  return NextResponse.json({
    success: true,
  });
}