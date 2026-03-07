"use server"
import { db } from "@/db";
import { customer } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CreateCustomerInput } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
type CustomerData = {
    name: string;
    phoneNo: string;
    address: string;
}
export const getUserId = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
};
export const createCustomer = async ({
  customerData
}: {
  customerData: CustomerData;
}) => {
  try {
    const userId = await getUserId();
    const data ={
      ...customerData,
      userId
    }
    const newCustomer = await db
      .insert(customer)
      .values(data)
      .returning();
          revalidatePath("/Debts")

      return { success: true, data: newCustomer };
    } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
};

export const updateUser = async (customerData:CustomerData,customerId:string)=>{
    try {
  const updated = await db.update(customer).set(customerData).where(eq(customer.id,customerId)).returning();
    revalidatePath("/Debts")
  
  return{success:true,message:"user updated sucessfully",data:updated}
    }  catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
}

export const getUser = async (customerId:string)=>{
    try {
  const readUser = await db.select().from(customer).where(eq(customer.id,customerId))

return { success:true, data:readUser}
} catch (error) {
  if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
}
export const getAllUser = async ()=>{
  try {
    const readUser = await db.select().from(customer);
    
    return { success:true, data:readUser}
    } catch (error) {
        if (error instanceof Error) {
          return { message: error.message, success: false };
    } else {
        return { message: "Some internal server error", success: false };
      }
    }
  }
export const deleteUser = async (customerId:string)=>{
    try {
  const deletedUser = await db.delete(customer).where(eq(customer.id,customerId))
revalidatePath("/Debts")

 return {
      success: true,
      message: "Customer deleted successfully",
    }    } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
}