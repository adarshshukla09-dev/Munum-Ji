"use server"
import { db } from "@/db";
import { inventory } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CreateInventoryInput } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { success } from "zod";
type updateinventoryData = Partial<CreateInventoryInput>;

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
};

export const addinventory = async (formData: FormData): Promise<void> => {
  try {
    const userId = await getUser();
    const productName = formData.get("ProductName") as string;
    const price = Number(formData.get("Price"));
    const stock = Number(formData.get("Stock"));

    await db
      .insert(inventory)
      .values({ userId, productName, price, stock })
      .returning();

    revalidatePath("/Inventory");
  } catch (error) {
    console.log(error)
  }
};

export const updateinventory = async (inventoryData: updateinventoryData) => {
  try {
    const updated = await db.update(inventory).set(inventoryData).returning();

    return {
      success: true,
      message: "invetory updated sucessfully",
      data: updated,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
};

export const getProduct = async (inventoryId: string) => {
  try {
    const readinventory = await db
      .select()
      .from(inventory)
      .where(eq(inventory.id, inventoryId));

    return { success: true, data: readinventory };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
};
export const getAllProduct = async () => {
  try {
    const readinventory = await db.select().from(inventory);

    return { success: true, data: readinventory };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
};
export const deleteProduct = async (inventoryId: string) => {
  try {
    const deletedinventory = await db
      .delete(inventory)
      .where(eq(inventory.id, inventoryId));

    return { success: true, data: deletedinventory };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
};
