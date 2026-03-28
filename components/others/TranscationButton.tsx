"use client"
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import CreateBillModal from '../Debt/CreateBillModal';
import Cart from '../LivePurchase/Cart';
import { Button } from '../ui/button';

function TranscationButton() {
  const [open, setOpen] = useState(false);
  return (
  <>
      <Button
       onClick={()=>setOpen(true)}
        className="fixed bottom-4 right-4 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center cursor-pointer"
      >
        <PlusIcon size={24} />
      </Button>
      <Cart open={open} setOpen={setOpen} />
   </>
)
}

export default TranscationButton
