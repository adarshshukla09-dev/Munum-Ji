import { db } from "@/db"

import { customer, bill, payments } from "@/db/schema";
import { sql, sum } from "drizzle-orm";
import { date, success } from "zod";

type ChartData = {
  name: string
  udhar: number
  paid: number
}

export const AdminInfo = async () => {
  try {
    const totalCustomer = await db
      .select({
        totalLedger: sum(customer.ledger),
      })
      .from(customer);
const consumer =await db.select().from(customer)
    const totalDebt = await db
      .select({
        totalDebt: sum(bill.total),
      })
      .from(bill);

    const totalRecovery = await db
      .select({
        totalRecovery: sum(payments.amount),
      })
      .from(payments);
const totalDebtAmount = totalDebt?.[0] || 0;
const totalRecoveryAmount = totalRecovery?.[0] || 0;

const remaining = Number(totalDebtAmount) - Number(totalRecoveryAmount);
console.log(consumer.length)
    return {
      totalCusumer:consumer?.length,
      totalLedger: totalCustomer[0]?.totalLedger ?? 0,
      totalDebt: totalDebt[0]?.totalDebt ?? 0,
      totalRecovery: totalRecovery[0]?.totalRecovery ?? 0,
      remaining:Number(remaining),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function getMonthlyLedgerData(): Promise<ChartData[]> {
  const udharResult = await db.execute<{
    month: string
    udhar: number
  }>(sql`
    SELECT 
      TO_CHAR(date, 'Mon') as month,
      COALESCE(SUM(total),0)::int as udhar
    FROM ${bill}
    GROUP BY month
    ORDER BY MIN(date)
  `)

  const paidResult = await db.execute<{
    month: string
    paid: number
  }>(sql`
    SELECT 
      TO_CHAR(created_at, 'Mon') as month,
      COALESCE(SUM(amount),0)::int as paid
    FROM ${payments}
    GROUP BY month
    ORDER BY MIN(created_at)
  `)

  const map = new Map<string, ChartData>()

  for (const row of udharResult.rows) {
    map.set(row.month, {
      name: row.month,
      udhar: row.udhar,
      paid: 0,
    })
  }

  for (const row of paidResult.rows) {
    if (map.has(row.month)) {
      map.get(row.month)!.paid = row.paid
    } else {
      map.set(row.month, {
        name: row.month,
        udhar: 0,
        paid: row.paid,
      })
    }
  }

  return Array.from(map.values())
}

export async function paymentinfo(){
try {
  let pay=[]
  const allpayment = await db.select().from(payments)
  for(const p of allpayment){
    const customer = await db.query.customer.findFirst({
      where:(c,{eq})=>(eq(c.id,p.customerId))
    })
    pay.push({
      customerName:customer?.name,
      date:p.createdAt,
      amount:p.amount,
    })
  }
  return {
  
    data:pay
  }
} catch (error) {
  console.log(error)
}
}