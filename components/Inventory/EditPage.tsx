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
import { updateinventory } from "@/server-actions/inventory";
import { Pencil } from "lucide-react";

type Product = {
  id: string;
  productName: string;
  stock: number;
  price: number;
};

type ProductProps = {
  item: Product;
};

function EditPage({ item }: ProductProps) {
  const [productName, setProductName] = useState(item.productName);
  const [stock, setStock] = useState(item.stock);
  const [price, setPrice] = useState(item.price);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = async () => {
    await updateinventory({
      id: item.id,
      productName,
      stock,
      price,
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          Edit <Pencil size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Edit product details with their current price and stocks
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <Label>Product Name</Label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Field>

          <Field>
            <Label>Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </Field>

          <Field>
            <Label>Stock</Label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button onClick={handleUpdate}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditPage;