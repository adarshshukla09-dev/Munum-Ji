"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addinventory } from "@/server-actions/inventory";

function CreateProduct() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await addinventory(formData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="float-right m-4">
          <Button>Add+</Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add new product with their current price and stocks
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit}>
          <FieldGroup>
            <Field>
              <Label htmlFor="product_name">Product Name</Label>
              <Input
                id="product_name"
                name="product_name"
                defaultValue="ParleG"
              />
            </Field>

            <Field>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" name="price" defaultValue="5" />
            </Field>

            <Field>
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" name="stock" defaultValue="15" />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProduct;