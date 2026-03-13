"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getInventory, editBill } from "@/server-actions/debt";
import { Search, ShoppingCart, Edit3, X, Package, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface EditBillProps {
  bill: any; // The existing bill object from getCustomerBills
  onRefresh: () => void;
}

export default function EditBillModal({ bill, onRefresh }: EditBillProps) {
  const [inventory, setInventory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // Initialize cart with existing bill items
  useEffect(() => {
    if (open) {
      getInventory().then(setInventory);
      const existingItems = bill.udhar.map((item: any) => ({
        inventoryId: item.inventoryId,
        productName: item.productName,
        qty: item.qty,
        price: item.price,
      }));
      setCart(existingItems);
    }
  }, [open, bill]);

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.inventoryId === item.id);
      if (existing) return prev.map((i) => i.inventoryId === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { inventoryId: item.id, productName: item.productName, qty: 1, price: item.price }];
    });
  };

  const updateQty = (id: string, val: number) => {
    setCart(prev => prev.map(i => i.inventoryId === id ? { ...i, qty: Math.max(0, val) } : i));
  };

  const handleUpdate = async () => {
    if (cart.length === 0) return toast.error("Bill cannot be empty. Use delete instead.");
    
    const res = await editBill({
      billId: bill.id,
      items: cart,
    });

    if (res?.success) {
      toast.success("Bill updated and ledger adjusted");
      setOpen(false);
      onRefresh();
    }
  };

  const currentTotal = cart.reduce((s, i) => s + (i.qty * i.price), 0);
  const diff = currentTotal - bill.total;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600">
          <Edit3 size={14} />
        </Button>
      </DialogTrigger>
<DialogContent className="sm:max-w-[90vw] lg:max-w-250 w-full h-[85vh] flex flex-row gap-0 p-0 overflow-hidden rounded-3xl border-none shadow-2xl">        
        {/* Left Side: Inventory Search */}
        <div className="w-1/2 flex flex-col border-r bg-white p-6">
          <div className="flex items-center gap-2 mb-6 text-slate-700">
            <Package size={22} className="text-blue-600" />
            <h2 className="text-xl font-bold">Adjust Items</h2>
          </div>
          <Input 
            className="mb-4" 
            placeholder="Add more products..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {inventory
              .filter(i => i.productName.toLowerCase().includes(search.toLowerCase()))
              .map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded-xl hover:bg-slate-50">
                  <p className="font-medium">{item.productName}</p>
                  <Button size="sm" variant="ghost" onClick={() => addToCart(item)}>Add +</Button>
                </div>
              ))}
          </div>
        </div>

        {/* Right Side: Cart Adjustment */}
        <div className="w-1/2 flex flex-col bg-slate-50 p-6">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart size={22} />
            <h2 className="text-xl font-bold">Edit Bill #{bill.id.slice(0,6)}</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3">
            {cart.map(item => (
              <div key={item.inventoryId} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex-1">
                  <p className="font-bold">{item.productName}</p>
                  <p className="text-sm text-blue-600">₹{item.price} per unit</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    className="w-20 h-9 text-center font-bold" 
                    value={item.qty} 
                    onChange={(e) => updateQty(item.inventoryId, parseInt(e.target.value) || 0)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => setCart(cart.filter(c => c.inventoryId !== item.inventoryId))}>
                    <X size={16} className="text-slate-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-slate-500 text-sm">
              <span>Original Total:</span>
              <span>₹{bill.total}</span>
            </div>
            <div className="flex justify-between items-center text-slate-900 font-bold">
              <span>Revised Total:</span>
              <span className="text-2xl">₹{currentTotal}</span>
            </div>
            <div className={`flex justify-between items-center text-sm font-bold ${diff >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              <span>Ledger Adjustment:</span>
              <span>{diff >= 0 ? `+ ₹${diff}` : `- ₹${Math.abs(diff)}`}</span>
            </div>
            <Button onClick={handleUpdate} className="w-full h-12 mt-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold">
              <RefreshCw size={18} className="mr-2" /> Update Bill
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}