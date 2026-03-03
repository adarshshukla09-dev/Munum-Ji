import { db } from "@/db";
import { inventory } from "@/db/schema";
import { CreateInventoryInput } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { success } from "zod";
type updateinventoryData = Partial<CreateInventoryInput>;


export const addinventory = async ({
  inventoryData,
}: {
  inventoryData: CreateInventoryInput;
}) => {
  try {
    const newinventory = await db
      .insert(inventory)
      .values(inventoryData)
      .returning();

    return { success: true, data: newinventory };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
};

export const updateinventory = async (inventoryData:updateinventoryData)=>{
    try {
  const updated = await db.update(inventory).set(inventoryData).returning();
  
  return{success:true,message:"invetory updated sucessfully",data:updated}
    }  catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
}

export const getProduct = async (inventoryId:string)=>{
    try {
  const readinventory = await db.select().from(inventory).where(eq(inventory.id,inventoryId))

  return { success:true, data:readinventory}
    } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
}
export const getAllProduct = async ()=>{
    try {
        const readinventory = await db.select().from(inventory);
        
        return { success:true, data:readinventory}
    } catch (error) {
        if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
        return { message: "Some internal server error", success: false };
    }
  }
}
export const deleteProduct = async (inventoryId:string)=>{
    try {
  const deletedinventory = await db.delete(inventory).where(eq(inventory.id,inventoryId))

  return { success:true, data:deletedinventory}
    } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
}