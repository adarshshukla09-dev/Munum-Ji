import { pgTable,integer, text, timestamp, boolean, index, uuid } from "drizzle-orm/pg-core";
export {db} from "@/db"
import {user} from "./auth-schema"


export const customer = pgTable("customer",{
userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  id: uuid().defaultRandom().primaryKey(),
  name:text("name").notNull(),
  phoneNo:text("phone_no").notNull(),
  address:text("address").notNull(),
})

export const allUdhar = pgTable("allUdhar",{
  id: uuid().defaultRandom().primaryKey(),
    customerId:uuid("customer_id").notNull().references(()=>customer.id ,{ onDelete : "cascade"}),
    date:timestamp("date").defaultNow().notNull(),
    product:text("product_name").notNull(),
    qty:integer().notNull(),
    price:integer().notNull(),
    totalprice:integer().notNull(),   // qty x price

})

export const inventory = pgTable("inventory", {
  id: uuid().defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),

  productName: text("product_name").notNull(),
  stock: integer("stock").notNull(),
  price: integer("price").notNull(),
});














// export const function_name = async () =>{
//     try {
        
//     } catch (error) {
//         if( error instanceof Error){
//         return { message:error.message ,status:500}
//         }
//     }
// }
// // export const function_name = async () =>{
// //     try {
        
// //     } catch (error) {
// //         if( error instanceof Error){
// //         return { message:error.message ,status:500}
// //         }
// //     }
// // }