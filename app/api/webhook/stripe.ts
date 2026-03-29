import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db"; 
import { paymentLP } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(` Webhook signature failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const paymentId = session.metadata?.paymentId;
      const shopkeeperId = session.metadata?.shopkeeperId;

      if (!paymentId) {
        console.error("Missing paymentId in metadata");
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      const [existing] = await db
        .select()
        .from(paymentLP)
        .where(eq(paymentLP.id, paymentId))
        .limit(1);

      if (!existing || existing.status === "success") {
        return NextResponse.json({ received: true });
      }

      await db
        .update(paymentLP)
        .set({
          status: "success",
          stripePaymentIntentId: session.payment_intent as string,
        })
        .where(eq(paymentLP.id, paymentId));

     
      if (shopkeeperId) {
        console.log(`Triggering notification for shopkeeper: ${shopkeeperId}`);
      }

      console.log("Payment success updated in DB:", paymentId);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}