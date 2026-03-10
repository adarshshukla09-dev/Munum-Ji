"use server";

import { db } from "@/db";
import { customer, udhar } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
type UdharInput = {
  id: string;
  customerId: string;
  totalprice?: number;
  date?: Date;
  product?: string;
  qty?: number;
  price?: number;
  prev: number;
};

type debt = {
  customerId: string;
  product: string;
  qty: number;
  price: number;
  totalprice: number;
};

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
};

export const addUdhar = async ({ allUdharData }: { allUdharData: debt }) => {
  try {
    console.log(allUdharData);
    const date = new Date();
    const totalprice = allUdharData.qty * allUdharData.price;
    const data = {
      ...allUdharData,
      date,
      totalprice,
    };
    const newallUdhar = await db.insert(udhar).values(data).returning();
    const debt = await db.query.customer.findFirst({
      where: (customer, { eq }) => eq(customer.id, allUdharData.customerId),
    });
    if (!debt) {
      return { success: false, Message: "can't find legder" };
    }
    const newLedger = debt.ledger + totalprice;
    await db
      .update(customer)
      .set({ ledger: newLedger })
      .where(eq(customer.id, allUdharData.customerId));

    return { success: true, data: newallUdhar };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
};

export const updateUdhar = async (data: UdharInput) => {
  try {
    const udharId = data.id;

    const existing = await db
      .select()
      .from(udhar)
      .where(eq(udhar.id, udharId))
      .limit(1);

    if (!existing.length) {
      return { success: false, message: "Udhar not found" };
    }

    const debt = await db.query.customer.findFirst({
      where: (customer, { eq }) => eq(customer.id, data.customerId),
    });

    if (!debt) {
      return { success: false, message: "Customer not found" };
    }

    // calculate new ledger
    const newLedger = debt.ledger - data.prev + (data.totalprice ?? 0);

    const updated = await db
      .update(udhar)
      .set({
        totalprice: data.totalprice,
        product: data.product,
        qty: data.qty,
        price: data.price,
        date: data.date,
      })
      .where(eq(udhar.id, udharId))
      .returning();
    await db
      .update(customer)
      .set({ ledger: newLedger })
      .where(eq(customer.id, data.customerId));

    return {
      success: true,
      message: "Udhar updated successfully",
      data: updated,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    }
    return { message: "Some internal server error", success: false };
  }
};

export const getUdhar = async (customerId: string) => {
  try {
    const readUser = await db
      .select()
      .from(udhar)
      .where(eq(udhar.customerId, customerId));

    return { success: true, data: readUser };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
};
export const deleteUdhar = async (allUdharId: string) => {
  try {
    const existing = await db.query.udhar.findFirst({
      where: (u, { eq }) => eq(u.id, allUdharId),
    });

    if (!existing) {
      return { success: false, message: "Udhar not found" };
    }

    const cust = await db.query.customer.findFirst({
      where: (c, { eq }) => eq(c.id, existing.customerId),
    });

    if (cust) {
      const newLedger = cust.ledger - existing.totalprice;

      await db
        .update(customer)
        .set({ ledger: newLedger })
        .where(eq(customer.id, existing.customerId));
    }

    await db.delete(udhar).where(eq(udhar.id, allUdharId));
    return { success: true, message: "deleted sucessfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
};
