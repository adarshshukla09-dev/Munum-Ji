import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
     const searchParams = useSearchParams()
  const customerId = searchParams.get('customer_id')
  return (
    <div className="text-center items-center ">

      <h1>✅ Payment Successful {customerId}</h1>
      <p>Thank you for your purchase.</p>
      <Link href="/">Go back home</Link>
    </div>
  );
}