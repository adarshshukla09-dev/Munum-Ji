import { db } from "@/db";
import { customer } from "@/db/schema";
import { CreateCustomerInput } from "@/lib/validations";
import { eq } from "drizzle-orm";
type updateCustomerData = Partial<CreateCustomerInput>;

export const createCustomer = async ({
  customerData
}: {
  customerData: CreateCustomerInput;
}) => {
  try {
    const newCustomer = await db
      .insert(customer)
      .values(customerData)
      .returning();

    return { success: true, data: newCustomer };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
};

export const updateUser = async (customerData:updateCustomerData,customerId:string)=>{
    try {
  const updated = await db.update(customer).set(customerData).where(eq(customer.id,customerId)).returning();
  
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

  return { success:true, data:deletedUser}
    } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Some internal server error", success: false };
    }
  }
}