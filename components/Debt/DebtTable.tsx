"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUdhar } from "@/server-actions/debt";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import CreateDebt from "./CreateDebt";
import { toast } from "sonner";
import { useState } from "react";
import EditDebts from "./EditDebts";

type Debt = {
  id: string;
  customerId: string;
  date: Date;
  product: string;
  qty: number;
  price: number;
  totalprice: number;
};

type DebtTableProps = {
  data?: Debt[];
  customerId: string;
};

function DebtTable({ data, customerId }: DebtTableProps) {
  const [isEdit,setIsEdit] =useState<boolean>(false)
  return (

    <div className="w-full overflow-x-auto">
      <div className="float-right mb-4">
        <CreateDebt customerId={customerId} />
      </div>

      <Table className="w-full">
        <TableCaption>A list of your recent products.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-200">
              <TableCell className="font-medium">
                {new Date(item.date).toLocaleDateString()}
              </TableCell>

              <TableCell>{item.product}</TableCell>

              <TableCell>{item.qty}</TableCell>

              <TableCell>₹{item.price}</TableCell>

              <TableCell>₹{item.totalprice}</TableCell>

              <TableCell className="flex m-2">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    await deleteUdhar(item.id);
                    toast.success(`deleted ${item.product}`)
                  }}
                >
                   
                  <Trash2 size={16} />
                </Button>
                <EditDebts data={item}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
     </div>
  );
}

export default DebtTable;