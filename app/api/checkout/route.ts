import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { customer } from "@/db/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { customerId } = await req.json();

const customer = await db.query.customer.findFirst({
  where: (customer, { eq }) => eq(customer.id, customerId),
});
if(!customer){
    return {success:false , message:"invaild customerId" }
}
 const ledger = customer?.ledger
const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "ledger"
          },
          unit_amount: ledger*100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_BASE_URL}/success?customer_id=${customerId}`,
    cancel_url: `${process.env.NEXT_BASE_URL}/cancel`,
  });

  return NextResponse.json({ url: session.url });
}