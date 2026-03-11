import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="text-center items-center ">
      <h1>❌ Payment Cancelled</h1>
      <p>Your payment was not completed.</p>
     <Link href="/">Try Again </Link>
    </div>
  );
}