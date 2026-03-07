import { z } from "zod"

export const customerSchema = z.object({
  name: z.string().trim().min(5),
  phoneNo: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  address: z.string().trim().min(5),
})

export const allUdharSchema = z.object({
  date: z.coerce.date(),
  product: z.string().trim().min(1),
  qty: z.number().int().positive(),
  price: z.number().int().positive(),
})

export const inventorySchema = z.object({
  productName: z.string().trim().min(3),
  stock: z.number().int().nonnegative(),
  price: z.number().int().positive(),
})

export type CreateCustomerInput = z.infer<typeof customerSchema>
export type CreateUdharInput = z.infer<typeof allUdharSchema>
export type CreateInventoryInput = z.infer<typeof inventorySchema>