"use server"

import { db } from "@/db";
import { udhar } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CreateUdharInput } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { success } from "zod";
type updateallUdharData = Partial<CreateUdharInput>;

type debt ={
    customerId: string;
    product: string;
    qty: number;
    price: number;
    totalprice: number;
}

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
};
 
export const addUdhar = async ({
  allUdharData,
}: {
  allUdharData: debt;
}) => {
  try {
    console.log(allUdharData)
    const date = new Date()
     const data ={
      ...allUdharData,
      date,
      totalprice: allUdharData.qty * allUdharData.price,
    };
    const newallUdhar = await db
      .insert(udhar)
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
  data: updateallUdharData
) => {
  try {
    if(!data.id){
return {success:false , message :"id is un defined"}
    }
    let  udharId:string;
    udharId = data?.id;
    if (udharId) {
      const existing = await db
      .select()
      .from(udhar)
      .where(eq(udhar.id, data.id))
      .limit(1);
      
      if (!existing.length) {
        return { success: false, message: "Udhar not found" };
      }

      
          }
    const updated = await db
      .update(udhar)
      .set(data)
      .where(eq(udhar.id,udharId))
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
export const deleteUdhar = async (allUdharId:string)=>{
    try {
  const deletedUser = await db.delete(udhar).where(eq(udhar.id,allUdharId))

  return { success:true,message:"deleted sucessfully"}
    } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
}