import AdminPage from "@/components/Admin";
import { auth } from "@/lib/auth";
import { AdminInfo, getMonthlyLedgerData, paymentinfo } from "@/server-actions/Admin";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
     const session = await auth.api.getSession({
          headers:await headers()
      })
  
      if(!session){
          redirect("/register")
      }
        const data = await getMonthlyLedgerData()
      const admin = await AdminInfo()
      const pay = await paymentinfo()
      console.log(data)
      console.log(admin)
if (!pay) return null;
  return (
   <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6">
    welcome
  <AdminPage adminInfo={admin} data={data} pay={pay.data} />
   </div>
   </div>
  );
}
