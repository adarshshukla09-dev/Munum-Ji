import CreateProduct from '@/components/Inventory/CreateProduct';
import ProductTable from '@/components/Inventory/ProductTable'
import { auth } from '@/lib/auth';
import { getAllProduct } from '@/server-actions/inventory'
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

async function page() {
   const session = await auth.api.getSession({
            headers:await headers()
        })
    
        if(!session){
            redirect("/register")
        }
        const userId = session?.user?.id;
  const allProduct = await getAllProduct();
  const data = allProduct.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Manage Products
            </h1>
            <p className="text-gray-500 mt-2">
              View, create and manage your inventory products.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <CreateProduct />
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-6">
          <ProductTable data={data} />
        </div>

      </div>
    </div>
  )
}

export default page