"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

function CreateDebt({ customerId }: { customerId: string }) {

  const router = useRouter();

  const handleCreate = () => {
    console.log(customerId)

    router.push(`/Debts/create-debts/${customerId}`)
  }

  return (
    <div>
      <Button onClick={handleCreate}>
        Create
      </Button>
    </div>
  )
}

export default CreateDebt;