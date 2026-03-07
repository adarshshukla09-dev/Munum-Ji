import CustomerTable from '@/components/Customer/CustomerTable'
import { getAllUser } from '@/server-actions/customer'
import React from 'react'

async function page() {
  const allUser = await getAllUser();
  const data = allUser?.data;

  return (
   <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Manage Debts
            </h1>
            <p className="text-gray-500 mt-2">
              View, create and manage your debts products.
            </p>
          </div>

          <div className="mt-4 md:mt-0">

          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-6">
{data && <CustomerTable data={data}/>}
        </div>

      </div>
    </div>
  )
}

export default page
