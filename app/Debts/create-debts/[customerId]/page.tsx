"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addUdhar } from "@/server-actions/debt";
import { getAllProduct } from "@/server-actions/inventory";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Page({ params }: { params: { customerId: string } }) {

  const customerId = params.customerId;

  const [data, setData] = useState<any[]>([]);
  const [product, setProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(10);
  const [totalprice, setTotalPrice] = useState(0);
  const [debt,setDebt] =useState<any[]>([]);
  useEffect(() => {
    async function loadProducts() {
      const allProduct = await getAllProduct();
      setData(allProduct.data ?? []);
    }

    loadProducts();
  }, []);

  useEffect(() => {
    setTotalPrice(qty * price);
  }, [qty, price]);

  const handleCreate = async () => {
    const d={
      product,
      qty,
      price,totalprice
    }
   setDebt((prev)=>[...prev,d])

    toast.success("New debt added successfully");
  };

  return (
       <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6">
   <div className="grid grid-cols-3 gap-6 h-[75vh]">

  {/* LEFT SIDE */}
  <div className="col-span-2 flex flex-col gap-6">

    {/* PRODUCTS */}
    <div className="border rounded-lg overflow-hidden flex-1">

      <div className="p-4 border-b font-semibold">
        Available Products
      </div>

      <div className="overflow-y-auto h-3/4">

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => {
                  setProduct(item.productName)
                  setPrice(item.price)
                }}
                className="cursor-pointer hover:bg-green-50"
              >
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>₹{item.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>

      </div>
    </div>


    {/* ADDED DEBTS */}
    <div className="border rounded-lg h-3/4 overflow-hidden flex-1">

      <div className="p-4 border-b font-semibold">
        Added Debts
      </div>

      <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {debt.map((item) => (
              <TableRow
              
                className="cursor-pointer hover:bg-green-50"
              >
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell>₹{item.totalprice}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>


    </div>

  </div>


  {/* RIGHT PANEL */}
  <div className="border rounded-lg p-6 flex flex-col justify-between">

    <div className="space-y-5">

      <h3 className="font-semibold text-lg">
        Debt Details
      </h3>

      <FieldGroup>

        <Field>
          <Label>Product</Label>
          <Input value={product} disabled />
        </Field>

        <Field>
          <Label>Quantity</Label>
          <Input
            type="number"
            value={qty}
            onChange={(e)=>setQty(Number(e.target.value))}
          />
        </Field>

        <Field>
          <Label>Price</Label>
          <Input value={price} disabled />
        </Field>

        <Field>
          <Label>Total</Label>
          <Input value={totalprice} disabled />
        </Field>

      </FieldGroup>

    </div>

    <Button
      onClick={handleCreate}
      className="bg-green-600 hover:bg-green-700"
    >
      Add Debt
    </Button>

  </div>

</div>
</div>
    </div>
  );
}

export default Page;