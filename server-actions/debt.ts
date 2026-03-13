"use server";
import { db } from "@/db";
import { inventory, bill, udhar, customer } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
type BillItem = {
  inventoryId: string;
  qty: number;
  price: number;
};

type CreateBillInput = {
  customerId: string;
  items: BillItem[];
};

type UpdateBillInput = {
  billId: string;
  items: BillItem[];
};export const getInventory = async () => {
  return await db.select().from(inventory).where(sql`${inventory.stock} > 0`);
};
export const createBill = async (data: CreateBillInput) => {
  try {
    const result = await db.transaction(async (tx) => {
      let total: number = 0;

      for (const item of data.items) {
        total += item.qty * item.price;
      }

      const [newBill] = await tx
        .insert(bill)
        .values({
          customerId: data.customerId,
          total,
        })
        .returning();

      for (const item of data.items) {
        const inventoryItem = await tx.query.inventory.findFirst({
          where: (i, { eq }) => eq(i.id, item.inventoryId),
        });
        if (!inventoryItem) {
          return { success: false, message: "can't find the item" };
        }

        const totalprice = item.qty * item.price;

        await tx.insert(udhar).values({
          inventoryId: item.inventoryId,
          billId: newBill.id,
          date: newBill.date,
          qty: item.qty,
          productName: inventoryItem.productName,
          price: item.price,
          totalprice,
        });
       await tx
  .update(inventory)
  .set({
    stock: sql`${inventory.stock} - ${item.qty}`,
  })
  .where(eq(inventory.id, item.inventoryId));
        
      }await tx
          .update(customer)
          .set({
            ledger: sql`${customer.ledger}+${total}`,
          })
          .where(eq(customer.id, data.customerId));
    });
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    error instanceof Error
      ? console.log(error.message)
      : console.log("fail to create");
  }
};

export const editBill = async (data: UpdateBillInput) => {
  try {
    await db.transaction(async (tx) => {

      const existingBill = await tx.query.bill.findFirst({
        where: (b, { eq }) => eq(b.id, data.billId),
      });

      if (!existingBill) throw new Error("Bill not found");

      const oldItems = await tx.query.udhar.findMany({
        where: (u, { eq }) => eq(u.billId, data.billId),
      });

      for (const item of oldItems) {
        await tx
          .update(inventory)
          .set({
            stock: sql`${inventory.stock} + ${item.qty}`,
          })
          .where(eq(inventory.id, item.inventoryId));
      }

      await tx.delete(udhar).where(eq(udhar.billId, data.billId));

      let newTotal = 0;

      for (const item of data.items) {
        const product = await tx.query.inventory.findFirst({
          where: (i, { eq }) => eq(i.id, item.inventoryId),
        });

        if (!product) throw new Error("Product not found");

        const totalprice = item.qty * item.price;
        newTotal += totalprice;

        await tx.insert(udhar).values({
          billId: data.billId,
          inventoryId: item.inventoryId,
          productName: product.productName,
          price: item.price,
          qty: item.qty,
          totalprice,
          date: existingBill.date,
        });

        await tx
          .update(inventory)
          .set({
            stock: sql`${inventory.stock} - ${item.qty}`,
          })
          .where(eq(inventory.id, item.inventoryId));
      }

      const ledgerDiff = newTotal - existingBill.total;

      
      await tx
        .update(bill)
        .set({
          total: newTotal,
        })
        .where(eq(bill.id, data.billId));

      await tx
        .update(customer)
        .set({
          ledger: sql`${customer.ledger} + ${ledgerDiff}`,
        })
        .where(eq(customer.id, existingBill.customerId));
    });

    return { success: true };

  } catch (error) {
    error instanceof Error
      ? console.log(error.message)
      : console.log("fail to edit");
  }
};
export const deleteBill = async (billId: string) => {
  try {
    await db.transaction(async (tx) => {
      const existingBill = await tx.query.bill.findFirst({
        where: (b, { eq }) => eq(b.id, billId),
      });

      if (!existingBill) throw new Error("Bill not found");

      const items = await tx.query.udhar.findMany({
        where: (u, { eq }) => eq(u.billId, billId),
      });

      for (const item of items) {
        await tx
          .update(inventory)
          .set({
            stock: sql`${inventory.stock} + ${item.qty}`,
          })
          .where(eq(inventory.id, item.inventoryId));
      }

      await tx
        .update(customer)
        .set({
          ledger: sql`${customer.ledger} - ${existingBill.total}`,
        })
        .where(eq(customer.id, existingBill.customerId));

      await tx.delete(udhar).where(eq(udhar.billId, billId));

      await tx.delete(bill).where(eq(bill.id, billId));
    });

    return { success: true };
  } catch (error) {
    error instanceof Error
      ? console.log(error.message)
      : console.log("fail to delete");
  }
};
export const getCustomerBills = async (customerId: string) => {
  const rows = await db
    .select({
      bill: bill,
      udhar: udhar,
    })
    .from(bill)
    .leftJoin(udhar, eq(bill.id, udhar.billId))
    .where(eq(bill.customerId, customerId));

  // Since a join returns one row per item, we group them by bill ID
  const groupedBills = rows.reduce((acc: any, row) => {
    const billId = row.bill.id;
    if (!acc[billId]) {
      acc[billId] = { ...row.bill, udhar: [] };
    }
    if (row.udhar) {
      acc[billId].udhar.push(row.udhar);
    }
    return acc;
  }, {});

  return Object.values(groupedBills);
};