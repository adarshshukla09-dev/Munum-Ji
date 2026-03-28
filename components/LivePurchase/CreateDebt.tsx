"use client"

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Wallet, ShoppingCart, Trash2 } from 'lucide-react';
import { getAllUser } from '@/server-actions/customer';
import { toast } from 'sonner';
import { createBill } from '@/server-actions/debt';
import CreateCustomer from '../Customer/CreateCustomer';

interface customer {
  id: string;
  userId: string;
  name: string;
  phoneNo: string;
  address: string;
  ledger: number;
}

// Assuming your cart item structure looks something like this:
interface CartItem {
  inventoryId: string;
  productName: string;
  price: number;
  qty: number;
}

function CreateDebt({ cart }: { cart: CartItem[] }) {
  const [customers, setCustomers] = useState<customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  
  
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  const handleSave = async () => {
    setLoading(true)
    if (cart.length === 0) return toast.error("Please add items first");
    if (!selectedCustomerId) return toast.error("Please select a customer");
    
    const billItems = cart.map((item: CartItem) => ({
      inventoryId: item.inventoryId, 
      qty: item.qty,
      price: item.price,
    }));
    console.log(billItems)
    const res = await createBill({ customerId: selectedCustomerId, items: billItems });
    if (res?.success) {
      console.log(res)
      toast.success("Bill saved successfully");
      setLoading(false)
    }
  };
  
  useEffect(() => {
    console.log(cart)
    const fetchData = async () => {
      const res = await getAllUser();
      if (res?.data) setCustomers(res.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-8 py-6 shadow-lg transition-all flex gap-2">
          <Wallet className="w-5 h-5" />
          Add New Debt
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[95vw] lg:max-w-4xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-slate-50">
        <div className='fixed right-12 top-4 z-50'>
          <CreateCustomer />
        </div>

        <div className="flex flex-col md:row h-[80vh]">
          
          {/* LEFT PANEL: Selection */}
          <div className="w-full md:w-1/3 bg-white p-8 border-r border-slate-100 flex flex-col">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800">Assign Debt</h2>
              <p className="text-sm text-slate-500">Select a customer to begin</p>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-uppercase tracking-wider text-slate-400">CUSTOMER</Label>
              <Select onValueChange={setSelectedCustomerId} value={selectedCustomerId}>
                <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 focus:ring-orange-500">
                  <SelectValue placeholder={loading ? "Loading..." : "Select customer"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {customers.map((c: customer) => (
                      /* FIXED: value is now c.id instead of c.name */
                      <SelectItem key={c.id} value={c.id} className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px]">
                            {c.name.charAt(0)}
                          </div>
                          {c.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* RIGHT PANEL: Cart Items & Total */}
          <div className="flex-1 p-8 overflow-y-auto flex flex-col">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-slate-400 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Cart Summary
              </DialogTitle>
            </DialogHeader>

            {/* Cart Items List */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.inventoryId} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                      <h4 className="font-semibold text-slate-800">{item.productName}</h4>
                      <p className="text-sm text-slate-500">${item.price.toFixed(2)} x {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <p>Your cart is empty</p>
                </div>
              )}
            </div>

            {/* Total Footer */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium text-slate-600">Total Amount</span>
                <span className="text-3xl font-bold text-orange-600">${totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex gap-3">
                <Button
              
                  onClick={handleSave}
                  disabled={cart.length === 0 || loading}
                  className="flex-1 h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
                >
                  Confirm & Save Debt
                </Button>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateDebt