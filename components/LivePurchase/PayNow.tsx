"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, ShoppingCart, Banknote, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { cashPayment } from "@/server-actions/whatsapp";
import { toast } from "sonner";

interface CartItem {
  inventoryId: string;
  productName: string;
  price: number;
  qty: number;
}

interface PaymentQRProps {
  cart: CartItem[];
  shopkeeperId: string;
  createCheckoutSession: (cart: CartItem[], id: string) => Promise<string | null>;
}

export function PaymentQRDialog({ cart, shopkeeperId, createCheckoutSession }: PaymentQRProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe" | null>(null);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCashPayment = async () => {
    setPaymentMethod("cash");
    setLoading(true);
    try {
      await cashPayment(cart, shopkeeperId);
      toast.success("Cash payment recorded successfully");
    } catch (err) {
      setError("Failed to process cash payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    setPaymentMethod("stripe");
    if (url) return; // Don't regenerate if we already have a URL

    setLoading(true);
    setError(null);
    try {
      const sessionUrl = await createCheckoutSession(cart, shopkeeperId);
      if (sessionUrl) {
        setUrl(sessionUrl);
      } else {
        throw new Error("No URL returned");
      }
    } catch (err) {
      setError("Failed to generate Stripe link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => { if (!open) { setPaymentMethod(null); setError(null); } }}>
      <DialogTrigger asChild>
        <Button className="w-1/4 h-14 text-md font-black bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg transition-all">
          Pay Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md flex flex-col items-center">
        <DialogHeader className="w-full text-center">
          <DialogTitle className="text-2xl font-bold">Checkout</DialogTitle>
          <DialogDescription>
            Total Amount: <span className="font-bold text-foreground text-lg">₹{totalAmount.toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 w-full my-4">
          <Button
            variant={paymentMethod === "cash" ? "default" : "outline"}
            className={`flex flex-col h-20 gap-2 ${paymentMethod === "cash" ? "bg-green-600 hover:bg-green-700" : ""}`}
            onClick={handleCashPayment}
            disabled={loading}
          >
            <Banknote size={20} />
            Cash
          </Button>

          <Button
            variant={paymentMethod === "stripe" ? "default" : "outline"}
            className={`flex flex-col h-20 gap-2 ${paymentMethod === "stripe" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            onClick={handleStripePayment}
            disabled={loading}
          >
            <CreditCard size={20} />
            Stripe
          </Button>
        </div>

        {totalAmount < 100 && (
          <p className="text-xs text-amber-600 font-medium mb-4 italic">
            * Stripe is recommended for amounts greater than ₹100
          </p>
        )}

        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border-2 border-dashed border-gray-200 min-h-62.5 w-full">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Processing...</p>
            </div>
          ) : error ? (
            <p className="text-destructive text-sm text-center">{error}</p>
          ) : paymentMethod === "stripe" && url ? (
            <div className="flex flex-col items-center gap-4">
              <QRCodeSVG value={url} size={180} level="H" includeMargin={true} className="rounded-lg border shadow-sm" />
              <p className="text-xs text-muted-foreground text-center">
                Scan to pay securely via Stripe
              </p>
            </div>
          ) : paymentMethod === "cash" ? (
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-2">
                <Banknote className="text-green-600" size={32} />
              </div>
              <p className="text-sm font-medium">Cash Payment Initiated</p>
              <p className="text-xs text-muted-foreground">Please collect cash from the customer.</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a payment method above</p>
          )}
        </div>

        <div className="w-full flex justify-between items-center text-[10px] uppercase tracking-wider text-muted-foreground mt-4 border-t pt-4">
          <span className="flex items-center gap-1"><ShoppingCart size={12}/> {cart.length} ITEMS</span>
          <span>TERMINAL: {shopkeeperId.slice(0, 8)}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}