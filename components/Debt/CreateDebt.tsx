"use client";

import React, { useEffect, useState } from "react";
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
import { Pencil, PlusCircle } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { addUdhar } from "@/server-actions/debt";
import { toast } from "sonner";

function CreateDebt({ customerId }: { customerId: string }) {
  const [product, setProduct] = useState<string>();
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(10);
  const [totalprice, setTotalPrice] = useState<number>();
    const [isOpen, setIsOpen] = useState(false);
  
console.log("customer id is ",customerId)
  useEffect(() => {
    if (price !== undefined && qty !== undefined) {
      setTotalPrice(qty * price);
    }
  }, [qty, price]);
  const data = {
    product,
    qty,
    price,
    totalprice,
    customerId,
  };

const handleCreate = async () => {
  await addUdhar({
    allUdharData: {
      customerId,
      product: product!,
      qty,
      price,
      totalprice: qty * price,
    },
  });
      setIsOpen(false);
toast.success("new one added successfully")
};

  return (
    <div>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            Create debt
            <span>
              <Pencil />
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl w-full">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
            <DialogDescription>
              create debts details with their
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="product">product</Label>
              <Input
                id="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                name="Name"
              />
            </Field>
            <Field>
              <Label htmlFor="qty">qty</Label>
              <Input
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value))}
              />
            </Field>
            <Field>
              <Label htmlFor="price">price</Label>
              <Input
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
              />
            </Field>

            <Field>
              <Label>Total</Label>
              <Input value={totalprice ?? 0} disabled />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreate}>create new</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateDebt;
