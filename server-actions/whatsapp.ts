"use server"
import { db } from "@/db";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const directMessage = async (customerId: string,payableLink:string) => {
  try {
    console.log("start")
    const customer = await db.query.customer.findFirst({
      where: (customer, { eq }) => eq(customer.id, customerId),
    });
    console.log(customer)
    if (!customer) {
      return { success: false, message: "Customer not found" };
    }
    const message = `Hi, this is a reminder that you have a debt of ₹${customer.ledger}. Kindly pay by visiting shop or through this link ${payableLink}`;
    const phone = customer.phoneNo?.replace(/\D/g, "");
    console.log("end");

    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

    return { success: true, url };  } catch (error) {
error instanceof Error? console.error(error.message) : console.log(" went wrong")

    return { success: false,message:"something went wrong" };
  }
};




export const createAllPaymentLinks = async () => {
  const customers = await db.query.customer.findMany();

  const result = [];

  for (const c of customers) {
    if (c.ledger <= 0) continue;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      metadata: {
        customerId: c.id,
      },

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Debt payment for ${c.name}`,
            },
            unit_amount: c.ledger * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_BASE_URL}/cancel`,
    });

    const phone = c.phoneNo?.replace(/\D/g, "");

    const message = `Hi ${c.name}, reminder that you have a debt of ₹${c.ledger}. Kindly pay here: ${session.url}`;

    const whatsappLink = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

    result.push({
      name: c.name,
      phone,
      whatsappLink,
      paymentUrl: session.url,
    });
  }

  return result;
};