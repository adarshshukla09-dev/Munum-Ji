"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUdhar } from "@/server-actions/debt";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import CreateDebt from "./CreateDebt";
import { toast } from "sonner";
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
  return (
    <div className="w-full">
      
      <div className="flex justify-end m-4">
        <CreateDebt customerId={customerId} />
      </div>

      {/* Scroll container */}
      <div className="max-h-[55vh] overflow-y-auto border rounded-md">
        <Table className="w-full">

          <TableHeader className="sticky top-0 bg-white z-10">
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

                <TableCell className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={async () => {
                      await deleteUdhar(item.id);
                      toast.success(`Deleted ${item.product}`);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>

                  <EditDebts data={item} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>
    </div>
  );
}

export default DebtTable;