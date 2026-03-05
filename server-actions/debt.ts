import { db } from "@/db";
import { allUdhar } from "@/db/schema";
import { CreateUdharInput } from "@/lib/validations";
import { eq } from "drizzle-orm";
type updateallUdharData = Partial<CreateUdharInput>;


export const addUdhar = async ({
  allUdharData,
}: {
  allUdharData: CreateUdharInput[];
}) => {
  try {
     const data = allUdharData.map((item) => ({
      ...item,
      totalprice: item.qty * item.price,
    }));
    const newallUdhar = await db
      .insert(allUdhar)
      .values(data)
      .returning();

    return { success: true, data: newallUdhar };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
};

export const updateUdhar = async (
  id: string,
  data: updateallUdharData
) => {
  try {
    // Recalculate totalprice if qty or price is updated
    let totalprice
    if (data.qty !== undefined || data.price !== undefined) {
      // First fetch existing record
      const existing = await db
      .select()
      .from(allUdhar)
      .where(eq(allUdhar.id, id))
      .limit(1);
      
      if (!existing.length) {
        return { success: false, message: "Udhar not found" };
      }

      const current = existing[0];
      
      const qty = data.qty ?? current.qty;
      const price = data.price ?? current.price;
      
 totalprice = qty *price;
    }
    let updatedData = { ...data,totalprice };

    const updated = await db
      .update(allUdhar)
      .set(updatedData)
      .where(eq(allUdhar.id, id))
      .returning();
      
      return {
        success: true,
        message: "Inventory updated successfully",
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

export const getUdhar = async (allUdharId:string)=>{
  try {
    const readUser = await db.select().from(allUdhar).where(eq(allUdhar.id,allUdharId))

  return { success:true, data:readUser}
    } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
}

export const deleteUdhar = async (allUdharId:string)=>{
    try {
  const deletedUser = await db.delete(allUdhar).where(eq(allUdhar.id,allUdharId))

  return { success:true, data:deletedUser}
    } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
}