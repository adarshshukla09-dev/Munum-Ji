import PaymentTable from '@/components/LivePurchase/PaymentTable';
import { getallPaymentLP } from '@/server-actions/payment'
const data = await getallPaymentLP();
const payments = Array.isArray(data) ? data : [];


function Page() {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Live sales payement 
            </h1>
           
          </div>

          <div className="mt-4 md:mt-0">

          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white shadow-md rounded-2xl border  p-6">
{data &&
      <PaymentTable data={payments}/>}
    </div>
    </div></div>
  )
}

export default Page
