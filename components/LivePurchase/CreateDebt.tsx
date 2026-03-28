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
import { Input } from '@/components/ui/input';
import { UserPlus, Wallet, ReceiptText } from 'lucide-react';
import { getAllUser } from '@/server-actions/customer';
import { toast } from 'sonner';
import { createBill } from '@/server-actions/debt';
interface customer {
        id: string;
        userId: string;
        name: string;
        phoneNo: string;
        address: string;
        ledger: number;
    
}
function CreateDebt({cart}:{cart:any}) {
  const [customers, setCustomers] = useState<customer[]>([]);
  const [loading, setLoading] = useState(true);
const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

 const handleSave = async () => {
    if (cart.length === 0) return toast.error("Please add items first");
    if (!selectedCustomerId) return toast.error("Please select a customer");
    const res = await createBill({ customerId:selectedCustomerId, items: cart });
    if (res?.success) {
      toast.success("Bill saved successfully");
     
    }
  };  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllUser();
      if (res?.data) setCustomers(res.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Dialog>
      {/* Trigger must be outside DialogContent */}
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-8 py-6 shadow-lg transition-all flex gap-2">
          <Wallet className="w-5 h-5" />
          Add New Debt
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[95vw] lg:max-w-200 p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-slate-50">
        <div className="flex flex-col md:flex-row h-[70vh]">
          
          {/* LEFT PANEL: Selection */}
          <div className="w-full md:w-1/3 bg-white p-8 border-r border-slate-100 flex flex-col">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800">Assign Debt</h2>
              <p className="text-sm text-slate-500">Select a customer to begin</p>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-uppercase tracking-wider text-slate-400">CUSTOMER</Label>
<Select onValueChange={setSelectedCustomerId} value={selectedCustomerId}>                <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 focus:ring-orange-500">
                  <SelectValue placeholder={loading ? "Loading..." : "Select customer"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {customers.map((c: customer) => (
                      <SelectItem key={c.id} value={c.name} className="py-3">
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

          {/* RIGHT PANEL: Form Details */}
          <div className="flex-1 p-8 overflow-y-auto">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-slate-400 uppercase text-xs tracking-[0.2em]">Transaction Details</DialogTitle>
            </DialogHeader>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input id="amount" type="number" placeholder="0.00" className="h-12 rounded-xl" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="note">Description / Note</Label>
                <textarea 
                  id="note"
                  className="w-full min-h-25 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="What is this debt for?"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                onClick={handleSave}
                className="flex-1 h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                  Confirm Debt
                </Button>
                <Button variant="outline" className="h-12 rounded-xl">
                  Cancel
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