import AdminPage, { AdminDashboardData } from "@/components/others/Admin";
import { auth } from "@/lib/auth";
import { AdminInfo, getMonthlyLedgerData, paymentinfo } from "@/server-actions/Admin";
import { getallPaymentLP } from "@/server-actions/payment";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function Home() {
     const session = await auth.api.getSession({
          headers:await headers()
      })
  
      if(!session){
          redirect("/register")
      }
   const [chartData, stats, payResponse, lpResponse] = await Promise.all([
    getMonthlyLedgerData(),
    AdminInfo(),
    paymentinfo(),
    getallPaymentLP(),
  ]);

  // 2. Safely handle the union type (Array vs Success Object)
  const paymentDetails = Array.isArray(lpResponse) ? lpResponse : [];

  if (!payResponse?.data) return null;

  // 3. Constructing the single data object
  const dashboardData: AdminDashboardData = {
    stats,
    chartData,
    debtPayments: payResponse.data,
liveSales: paymentDetails,  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <AdminPage dashboardData={dashboardData} />
      </div>
    </div>
  );
}