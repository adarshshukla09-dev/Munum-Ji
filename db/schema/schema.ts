import {
  pgTable,
  integer,
  text,
  timestamp,
  boolean,
  index,pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const notificationTypeEnum = pgEnum("notification_type", [
  "payment",
  "inventory",
]);
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



export const bill = pgTable("bill", {
  id: uuid().defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),
      date: timestamp("date").defaultNow().notNull(),
total :integer().notNull()
});

export const udhar = pgTable("udhar", {
  id: uuid().defaultRandom().primaryKey(),
  inventoryId: uuid("inventory_id")
    .notNull()
    .references(() => inventory.id, { onDelete: "cascade" }),

  billId: uuid("bill_id")
    .notNull()
    .references(() => bill.id, { onDelete: "cascade" }),

  date: timestamp("date").defaultNow().notNull(),

  qty: integer().notNull(),
  productName: text("product_name").notNull(),
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
export const notifications = pgTable("notifications", {
  id: uuid().defaultRandom().primaryKey(),

  name:text("name").notNull(),

  type: notificationTypeEnum("type").notNull(), 

  message: text("message").notNull(),

  isRead: boolean("is_read").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});