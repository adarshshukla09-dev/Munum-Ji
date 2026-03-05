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
import { addinventory, updateinventory } from '@/server-actions/inventory'
import { Pencil } from 'lucide-react'


type Product = {
  id: string;
  productName: string,
  stock: number ,
  price: number,
}
type ProductProps = {
  item: Product
}
function EditPage({item}:ProductProps) {
    const [ productName,setProductName] =useState(item.productName)
   const [stock,setStock] = useState(item.stock)
   const [price,setPrice] = useState(item.price)

   const data = {
     id:item.id,
    productName,
    stock,
    price,
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
              edit product details with their current price and stocks 
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="Product-Name">ProductName</Label>
              <Input id="Product-Name" value={productName} onChange={(e)=>setProductName(e.target.value)} name="ProductName"  />
            </Field>
            <Field>
              <Label htmlFor="price">Price</Label>
              <Input value={price} onChange={(e)=>setPrice(parseInt(e.target.value))}  defaultValue={`${price}`} />
            </Field>
            <Field>
              <Label htmlFor="stock">Stock</Label>
              <Input  type="number" value={stock} onChange={(e)=>setStock(parseInt(e.target.value))} defaultValue={`${stock}`} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onSubmit={()=>updateinventory(data)} type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    </div>
  )
}

export default EditPage
