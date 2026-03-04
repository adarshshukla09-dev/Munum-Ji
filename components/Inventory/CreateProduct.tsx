import React from 'react'
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
import { addinventory } from '@/server-actions/inventory'
function CreateProduct() {
  return (
    <div>
        <Dialog>
      <form action={addinventory}>
        <DialogTrigger asChild>
      <div className='float-right m-4  '><Button>Add+</Button></div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Add new product with their current price and stocks 
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="Product-Name">ProductName</Label>
              <Input id="Product-Name" name="ProductName" defaultValue="ParleG" />
            </Field>
            <Field>
              <Label htmlFor="price">Price</Label>
              <Input id="Price" type="number" name="Price" defaultValue="5" />
            </Field>
            <Field>
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" name="Stock" defaultValue="15" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
    </div>
  )
}

export default CreateProduct
