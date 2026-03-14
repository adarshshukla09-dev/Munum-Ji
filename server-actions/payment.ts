import { db } from "@/db";
import { customer, payments } from "@/db/schema";
import { eq } from "drizzle-orm";

type PaymentInput = {
  customerId: string;
  amount: number;
};

export const saveDebtToDetails = async (data: PaymentInput) => {
  try {
    const result = await db.transaction(async (tx) => {

      await tx.insert(payments).values({
        customerId: data.customerId,
        amount: data.amount,
      });

      const existingUser = await tx.query.customer.findFirst({
        where: (c, { eq }) => eq(c.id, data.customerId),
      });

      if (!existingUser) {
        throw new Error("User not found");
      }

      const updated = await tx
        .update(customer)
        .set({
          ledger: existingUser.ledger - data.amount,
        })
        .where(eq(customer.id, data.customerId))
        .returning();

      return updated;
    });

    return { success: true, data: result };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};