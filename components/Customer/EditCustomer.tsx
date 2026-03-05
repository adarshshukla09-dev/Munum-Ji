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
import { Pencil } from 'lucide-react'
import { updateUser } from '@/server-actions/customer'
import { Textarea } from '../ui/textarea'

type Customer = {
 id: string;
    name: string;
    phoneNo: string;
    address: string;
}
type CustomerProps = {
  item: Customer
}
function EditCustomer({item}:CustomerProps) {
    const [ name,setName] =useState("")
   const [phoneNo,setPhoneNo] = useState("")
   const [address,setAddress] = useState("")

   const data = {
     id:item.id,
   name,
   phoneNo,
   address,
   }
  return (
    <div>
        <Dialog>
     
        <DialogTrigger asChild>
      <Button>edit<span><Pencil/></span></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              edit Customer details 
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="CustomerName">Name</Label>
              <Input id="Customer Name" value={name} onChange={(e)=>setName(e.target.value)} name="CustomerName"  />
            </Field>
            <Field>
              <Label htmlFor="phoneNo">phoneNo</Label>
              <Input value={phoneNo} onChange={(e)=>setPhoneNo((e.target.value))}  defaultValue={`${phoneNo}`} />
            </Field>
            <Field>
              <Label htmlFor="address">address</Label>
              <Textarea cols={7} rows={3}  value={address} onChange={(e)=>setAddress((e.target.value))} defaultValue={`${address}`} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onSubmit={()=>updateUser(data,item.id)} type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    </div>
  )
}

export default EditCustomer
