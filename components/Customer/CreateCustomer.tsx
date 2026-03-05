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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, PlusCircle } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { createCustomer } from '@/server-actions/customer'


type Customer = {
    userId:string;
    name: string;
    phoneNo: string;
    address: string;
}
type CustomerProps = {
  item: Customer
}
function CreateCustomer({item}:CustomerProps) {
    const [ name,setName] =useState('')
   const [phoneNo,setPhoneNo] = useState("")
   const [address,setAddress] = useState("")

   const customerData = {
    userId:item.userId,
    name,
    phoneNo,
    address,
   }
  return (
    <div>
        <Dialog>
     
        <DialogTrigger asChild>
      <Button>Add<span><PlusCircle/></span></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
            <DialogDescription>
           Create Customer details with their current price and stocks 
              <br/>
          begin jounery of "LEN DEN" AND "HEADACHE" 😂
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="Name">Name</Label>
              <Input id="Name" value={name} onChange={(e)=>setName(e.target.value)} name="Name"  />
            </Field>
            <Field>
              <Label htmlFor="phoneNo">phoneNo</Label>
              <Input value={phoneNo} onChange={(e)=>setPhoneNo((e.target.value))}   />
            </Field>
            <Field>
              <Label htmlFor="stock">Stock</Label>
              <Textarea cols={7} rows={3} value={address} onChange={(e)=>setAddress((e.target.value))}  />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={()=> createCustomer({
      customerData
    })}></Button>
          </DialogFooter>
        </DialogContent>

    </Dialog>
    </div>
  )
}


export default CreateCustomer
