// import { drizzle } from "drizzle-orm/node-postgres"
// import { Pool } from "pg"
// export *  from "@/db/schema"
// export * from "@/db/schema/auth-schema"

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// })

// export const db = drizzle(pool, {
//   schema: {
//     ...schema,
//     ...authSchema
//   }
// })
// export const db = drizzle(pool)
export * from "./auth-schema"
export * from "./schema"