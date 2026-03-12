import {
  pgTable,
  integer,
  text,
  timestamp,
  boolean,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const customer = pgTable("customer", {
  id: uuid().defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phoneNo: text("phone_no").notNull(),
    address: text("address").notNull(),
    ledger: integer("ledger").default(0).notNull(), // running balance
  });
  
 export const udhar = pgTable("udhar", {
  id: uuid().defaultRandom().primaryKey(),

  customerId: uuid("customer_id")
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),

  inventoryId: uuid("inventory_id")
    .notNull()
    .references(() => inventory.id, { onDelete: "cascade" }),

  date: timestamp("date").defaultNow().notNull(),

  qty: integer().notNull(),
   productName:text("product_name"),
  price: integer().notNull(),

  totalprice: integer().notNull(),
});

export const inventory = pgTable("inventory", {
  id: uuid().defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productName: text("product_name").notNull(),
  stock: integer("stock").notNull(),
  price: integer("price").notNull(),
});

export const payments = pgTable("payments", {
  id: uuid().defaultRandom().primaryKey(),

  customerId: uuid("customer_id")
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),

  amount: integer("amount").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
