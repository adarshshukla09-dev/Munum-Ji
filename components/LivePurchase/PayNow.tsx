"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, QrCode, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

// Define your types based on your server function
interface CartItem {
  inventoryId: string; // Add this line!
  productName: string;
  price: number;
  qty: number;
}

interface PaymentQRProps {
  cart: CartItem[];
  shopkeeperId: string;
createCheckoutSession: (cart: CartItem[], id: string) => Promise<string | null>;}

export function PaymentQRDialog({ cart, shopkeeperId, createCheckoutSession }: PaymentQRProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
console.log(shopkeeperId)
  const handleGenerateQR = async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionUrl = await createCheckoutSession(cart, shopkeeperId);
      setUrl(sessionUrl);
    } catch (err) {
      setError("Failed to generate payment link. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => open && !url && handleGenerateQR()}>
      <DialogTrigger asChild>
        <Button
          className="w-1/4 h-14 text-md font-black float-end bg-green-600 mx-3 hover:bg-green-700 text-white rounded-2xl shadow-[0_10px_20px_-10px_rgba(22,163,74,0.4)] transition-all"
        >
          Pay Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md flex flex-col items-center">
        <DialogHeader className="w-full text-center">
          <DialogTitle className="text-2xl font-bold">Scan to Pay</DialogTitle>
          <DialogDescription>
            Total Amount: <span className="font-bold text-foreground">₹{totalAmount.toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-dashed border-gray-200 min-h-62.5 w-full">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-green-600" />
              <p className="text-sm text-muted-foreground">Generating Secure QR...</p>
            </div>
          ) : error ? (
            <p className="text-destructive text-sm text-center">{error}</p>
          ) : url ? (
            <div className="flex flex-col items-center gap-4">
              <QRCodeSVG 
                value={url} 
                size={200} 
                level="H" 
                includeMargin={true}
                className="rounded-lg shadow-sm"
              />
              <p className="text-xs text-muted-foreground text-center">
                Scan this code with your phone to complete payment via Stripe.
              </p>
            </div>
          ) : null}
        </div>

        <div className="w-full flex justify-between items-center text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1"><ShoppingCart size={14}/> {cart.length} items</span>
          <span>ID: {shopkeeperId.slice(0, 8)}...</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}