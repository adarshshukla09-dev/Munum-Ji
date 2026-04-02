"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";
import Link from "next/link";

// 1. Move the logic into a separate component
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      toast.error("Session ID missing");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (data.success) {
          toast.success("Payment recorded");
        } else {
          toast.error("Payment verification failed");
        }
      } catch (error) {
        toast.error("An error occurred during verification");
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-bold">✅ Payment Successful</h1>
      <p>Thank you for your purchase.</p>
      <Link href="/" className="text-blue-500 underline">
        Go back home
      </Link>
    </div>
  );
}

// 2. The main page component wraps the content in Suspense
export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<p>Loading payment status...</p>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}