"use server"
import { db } from "@/db";
import { log } from "console";
import { redirect } from "next/navigation";

export const directMessage = async (customerId: string) => {
  try {
    console.log("start")
    const customer = await db.query.customer.findFirst({
      where: (customer, { eq }) => eq(customer.id, customerId),
    });
    console.log(customer)
    if (!customer) {
      return { success: false, message: "Customer not found" };
    }
    const message = `Hi, this is a reminder that you have a debt of ₹${customer.ledger}. Kindly pay.`;
    const phone = customer.phoneNo?.replace(/\D/g, "");
    console.log("end");
    // console.log(link)

    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

    return { success: true, url };  } catch (error) {
error instanceof Error? console.error(error.message) : console.log(" went wrong")

    return { success: false,message:"something went wrong" };
  }
};


export const getReminderLinks = async () => {
  const customers = await db.query.customer.findMany();

  const links = customers
    .filter((c) => c.ledger > 0)
    .map((c) => {
      const phone = c.phoneNo?.replace(/\D/g, "");
      const message = `Hi ${c.name}, reminder that you have a debt of ₹${c.ledger}. Kindly pay.`;

      return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    });

  return links;
};