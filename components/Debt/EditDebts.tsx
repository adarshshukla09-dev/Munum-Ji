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
import { Pencil, PlusCircle } from "lucide-react";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
type debt = {
  id: string;
  customerId: string;
  date: Date;
  product: string;
  qty: number;
  price: number;
  totalprice: number;
};
type debtProps = {
  data?: debt;
};
function EditDebts({ data }: debtProps) {
  const [date, setDate] = useState(
    data?.date ? new Date(data.date).toISOString().split("T")[0] : "",
  );

  const [product, setProduct] = useState(data?.product);
  const [qty, setQty] = useState(data?.qty);
  const [price, setPrice] = useState(data?.price);
  const [totalprice, setTotalPrice] = useState(data?.totalprice);

  useEffect(() => {
    if (price !== undefined && qty !== undefined) {
      setTotalPrice(qty * price);
    }
  }, [qty, price]);

  useEffect(() => {
    if (price && qty) setTotalPrice(qty * price);
  }, [qty, price]);
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            edit
            <span>
              <Pencil />
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
            <DialogDescription>edit debts details with their</DialogDescription>
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
              <Label htmlFor="date">date</Label>
              <Input
                value={date}
                type="date"
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
            <Field>
              <Label>Total</Label>
              <Input value={totalprice ?? 0} disabled />
            </Field>
          </FieldGroup>
          <DialogFooter>
            {/* <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={()=> createCustomer({
      customerData
    })}></Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditDebts;
