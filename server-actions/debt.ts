"use server";

import { db } from "@/db";
import { customer, inventory, udhar } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
type UdharInput = {
  id: string;
  customerId: string;
  inventoryId: string;
  qty?: number;
  price?: number;
  totalprice?: number;
  date?: Date;
};

type debt = {
  customerId: string;
  product: string;
  qty: number;
  price: number;
  inventoryId:string;
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

    const result = await db.transaction(async (tx) => {

      const totalprice = allUdharData.qty * allUdharData.price
 const item = await tx.query.inventory.findFirst({
          where: (i,{ eq }) => eq(i.id, allUdharData.inventoryId)

 })
      const newUdhar = await tx.insert(udhar)
        .values({
          ...allUdharData,
          productName:item?.productName,
          totalprice,
          date: new Date()
        })
        .returning()

      const cust = await tx.query.customer.findFirst({
        where: (c, { eq }) => eq(c.id, allUdharData.customerId)
      })

      if (!cust) throw new Error("Customer not found")

      await tx.update(customer)
        .set({
          ledger: cust.ledger + totalprice
        })
        .where(eq(customer.id, allUdharData.customerId))

      await tx.update(inventory)
        .set({
          stock: sql`${inventory.stock} - ${allUdharData.qty}`
        })
        .where(eq(inventory.id, allUdharData.inventoryId))

      return newUdhar
    })

    return { success: true, data: result }

  } catch (error) {
    return { success: false, message: "Failed to add udhar" }
  }
}

export const updateUdhar = async (data: UdharInput) => {
try{
 const result = await db.transaction( async(tx)=>{
  const existing = await tx.query.udhar.findFirst({
    where:(u,{eq})=>eq(u.id,data.id)
  })

  if(!existing){
    return new Error("udhar not found") 
  }
   const newQty = data.qty ?? existing.qty;
      const newPrice = data.price ?? existing.price;
      const newTotal = newQty * newPrice;

     const ledgerDiff = newTotal - existing.totalprice;
      const qtyDiff = newQty - existing.qty;
 const productRes = await tx.query.inventory.findFirst({
  where:(i,{eq})=>eq(i.id,data.inventoryId)
 }) 
 const newProductName = productRes?.productName;
    const updated = await tx
        .update(udhar)
        .set({
          qty: newQty,
          price: newPrice,
          totalprice: newTotal,
          date: data.date ?? existing.date,
          productName:newProductName?? existing.productName,
        })
        .where(eq(udhar.id, data.id))
        .returning();
  await tx
        .update(customer)
        .set({
          ledger: sql`${customer.ledger} + ${ledgerDiff}`,
        })
        .where(eq(customer.id, existing.customerId));

      await tx
        .update(inventory)
        .set({
          stock: sql`${inventory.stock} - ${qtyDiff}`,
        })
        .where(eq(inventory.id, existing.inventoryId));

      return updated;
    });

    return {
      success: true,
      message: "Udhar updated successfully",
      data: result,
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
export const deleteUdhar = async (udharId: string) => {
  try {

    const result = await db.transaction(async (tx) => {

      const existing = await tx.query.udhar.findFirst({
        where: (u, { eq }) => eq(u.id, udharId),
      });

      if (!existing) {
        throw new Error("Udhar not found");
      }

      // return stock
      await tx
        .update(inventory)
        .set({
          stock: sql`${inventory.stock} + ${existing.qty}`,
        })
        .where(eq(inventory.id, existing.inventoryId));

      // reduce customer ledger
      await tx
        .update(customer)
        .set({
          ledger: sql`${customer.ledger} - ${existing.totalprice}`,
        })
        .where(eq(customer.id, existing.customerId));

      // delete udhar
      await tx.delete(udhar).where(eq(udhar.id, udharId));

      return existing;
    });

    return {
      success: true,
      message: "Udhar deleted successfully",
      data: result,
    };

  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Internal server error",
    };
  }
};
