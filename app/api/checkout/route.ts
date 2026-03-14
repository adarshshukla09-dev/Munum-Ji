import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { customer } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { customerId } = await req.json();

  const existingCustomer = await db.query.customer.findFirst({
    where: (c, { eq }) => eq(c.id, customerId),
  });

  if (!existingCustomer) {
    return NextResponse.json(
      { success: false, message: "Invalid customerId" },
      { status: 400 }
    );
  }

  const ledger = existingCustomer.ledger;

  if (!ledger || ledger <= 0) {
    return NextResponse.json(
      { success: false, message: "No pending amount" },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    metadata: {
      customerId,
    },

    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Ledger Payment",
          },
          unit_amount: ledger * 100,
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.NEXT_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_BASE_URL}/cancel`,
  });

  return NextResponse.json({
    url: session.url,
  });
}