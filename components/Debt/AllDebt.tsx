import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from 'lucide-react'
import DebtTable from './DebtTable'
import { getUdhar } from '@/server-actions/debt'

type data=  {
    id: string;
    customerId: string;
    date: Date;
    product: string;
    qty: number;
    price: number;
    totalprice: number;
}
async function AllDebt(CustomerId:string) {
    const getAll = await getUdhar(CustomerId);
    const data = getAll?.data;
  return (
    <div>
        <Dialog>
     
        <DialogTrigger asChild>
      <Button>Add<span><PlusCircle/></span></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add more</DialogTitle>
            <DialogDescription>
          More debt 
            </DialogDescription>
          </DialogHeader>

        
       <DebtTable data={data}/>
          
          {/* <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={()=> createCustomer({
      customerData
    })}></Button>
          </DialogFooter> */}
        </DialogContent>

    </Dialog>
    </div>
  )
}


export default AllDebt;
