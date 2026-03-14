"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      toast.error("Session ID missing");
      return;
    }

    const verifyPayment = async () => {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Payment recorded");
      } else {
        toast.error("Payment verification failed");
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">✅ Payment Successful</h1>
        <p>Thank you for your purchase.</p>
        <Link href="/" className="text-blue-500 underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}