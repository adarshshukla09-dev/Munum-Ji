"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getInventory } from "@/server-actions/debt";
// Import your Stripe action
import { Search, ShoppingCart, Plus, X, Package } from "lucide-react";
import CreateDebt from "./CreateDebt";
import { PaymentQRDialog } from "./PayNow";
import { createCheckoutSession } from "@/server-actions/whatsapp";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();
function Cart({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const { data: session } = authClient.useSession();
  const [inventory, setInventory] = useState<any[]>([]);
  const[loading,setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // 2. Fetch Inventory when dialog opens
  useEffect(() => {
    if (open) {
      getInventory().then(setInventory);
    }
  }, [open]);

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.inventoryId === item.id);
      if (existing)
        return prev.map((i) =>
          i.inventoryId === item.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [
        ...prev,
        {
          inventoryId: item.id,
          productName: item.productName,
          qty: 1,
          price: item.price,
        },
      ];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.inventoryId === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i,
      ),
    );
  };

  const filteredItems = inventory.filter((i) =>
    i.productName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[90vw] lg:max-w-250 w-full h-[85vh] flex flex-row gap-0 p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="hidden">
          <DialogTitle>Cart</DialogTitle>
        </DialogHeader>

        {/* Left Pane: Inventory */}
        <div className="w-1/2 flex flex-col border-r bg-white p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="text-blue-600" />
            <h2 className="text-xl font-bold">Inventory</h2>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 border rounded-lg hover:border-blue-300 transition-colors group"
              >
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-xs text-gray-500 font-medium">
                    Stock: {item.stock} | Price: ₹{item.price}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => addToCart(item)}
                  className="group-hover:bg-blue-600 group-hover:text-white"
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Cart */}
        <div className="w-1/2 flex flex-col bg-slate-50 p-6">
          <div className="flex items-center gap-2 mb-6 text-slate-800">
            <ShoppingCart />
            <h2 className="text-xl font-bold">New Bill Items</h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {cart.map((item) => (
              <div
                key={item.inventoryId}
                className="group flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    {item.productName}
                  </p>
                  <p className="text-xs font-bold text-blue-600">
                    ₹{item.price}{" "}
                    <span className="text-slate-400 font-normal">/ unit</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
                    <button
                      onClick={() => updateQty(item.inventoryId, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-all"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-black text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.inventoryId, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-all"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-300 hover:text-red-500"
                    onClick={() =>
                      setCart(
                        cart.filter((c) => c.inventoryId !== item.inventoryId),
                      )
                    }
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-900 font-bold">Grand Total</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">
                ₹
                {cart.reduce((s, i) => s + i.qty * i.price, 0).toLocaleString()}
              </span>
            </div>

            <div className="flex gap-2">
              {/* Ensure userId exists before rendering to avoid errors */}
           
           {session?.user?.id && (
  <PaymentQRDialog
    cart={cart}
    shopkeeperId={session.user.id}
    createCheckoutSession={createCheckoutSession}
  />
)}
              <CreateDebt cart={cart} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Cart;
