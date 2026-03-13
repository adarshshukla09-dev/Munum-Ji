"use client";

import { useEffect, useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { getCustomerBills, deleteBill } from "@/server-actions/debt";
import CreateBillModal from "./CreateBillModal";
import { Trash2, Edit, Calendar, Hash } from "lucide-react";
import { toast } from "sonner";
import EditBillModal from "./EditBillModal";

export default function AllDebt({ customerId, open, setOpen }: { customerId: string, open: boolean, setOpen: (val: boolean) => void }) {
  const [bills, setBills] = useState<any[]>([]);

  const fetchBills = async () => {
    const data = await getCustomerBills(customerId);
    setBills(data);
  };

  useEffect(() => {
    if (open) fetchBills();
  }, [open, customerId]);

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure? This will revert stock and ledger.")){
        await deleteBill(id);
        toast.success("Bill deleted");
        fetchBills();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-2xl font-bold">Transaction History</DialogTitle>
          <CreateBillModal customerId={customerId} onRefresh={fetchBills} />
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {bills.length === 0 && <p className="text-center text-gray-500">No records found.</p>}
          
{bills.map((bill) => (
  <div key={bill.id} className="group border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 bg-white overflow-hidden">
    {/* Bill Header */}
    <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Invoice</span>
          <span className="font-mono text-sm font-semibold text-slate-700 underline decoration-slate-200 underline-offset-4">
            #{bill.id.slice(-8).toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-400" />
            {new Date(bill.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Amount Due</p>
          <p className="text-xl font-black text-slate-900">₹{bill.total.toLocaleString()}</p>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <EditBillModal bill={bill} onRefresh={fetchBills} />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full" 
            onClick={() => handleDelete(bill.id)}
          >
            <Trash2 size={16}/>
          </Button>
        </div>
      </div>
    </div>

    {/* Items Table */}
    <div className="px-6 pb-2">
      <table className="w-full">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-50">
            <th className="py-3 text-left font-bold">Product Details</th>
            <th className="py-3 text-center font-bold">Qty</th>
            <th className="py-3 text-right font-bold">Unit Price</th>
            <th className="py-3 text-right font-bold">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {bill.udhar.map((item: any) => (
            <tr key={item.id} className="text-sm text-slate-600 hover:bg-slate-50/30 transition-colors">
              <td className="py-3 font-medium text-slate-800">{item.productName}</td>
              <td className="py-3 text-center">
                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{item.qty}</span>
              </td>
              <td className="py-3 text-right text-slate-500 font-mono">₹{item.price}</td>
              <td className="py-3 text-right font-bold text-slate-900 font-mono">₹{item.totalprice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
))}
        </div>
      </DialogContent>
    </Dialog>
  );
}