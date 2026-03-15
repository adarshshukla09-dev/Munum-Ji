import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { success } from "zod";

type Data = {
  name: string;
  type: "payment" | "inventory";
  message: string;
};
export const addNotification = async (data: Data) => {
  try {
    const newNoti = await db.insert(notifications).values({
      name: data.name,

      type: data.type,

      message: data.message,
    });
    return {success:true,data:newNoti}
  } catch (error) {
    console.log(error);
  }
};

export const markRead = async (notiId:string)=>{
try {
    const existingNoti = await db.query.notifications.findFirst({
        where:(n,{eq})=>(eq(n.id,notiId))
    })
    if(!existingNoti){
        return {success:false}
    }
    const deleteNotification = await db.delete(notifications).where(eq(notifications.id,notiId))
    return {success:true,message :"readed the notification"}
} catch (error) {
    console.log(error)
}
}

export const allnotification = async ()=>{
    try {
        const allnotification = await db.select().from(notifications)
        return {success:true,data:allnotification}
    } catch (error) {
        console.log(error)
    }
}