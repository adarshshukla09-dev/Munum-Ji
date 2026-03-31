import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote } from "lucide-react";

type PaymentProps = {
  method: "CASH" | "CARD";
  amount: number;
  status: "pending" | "success" | "failed" | null;
  createdAt: Date;
};

type Props = {
  data: PaymentProps[];
};

export default function PaymentTable({ data }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((payment, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {payment.method === "CARD" ? (
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Banknote className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="capitalize">{payment.method.toLowerCase()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={payment.status} />
                </TableCell>
                <TableCell className="text-right font-mono">
                ₹{payment.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Sub-component for better readability
const StatusBadge = ({ status }: { status: PaymentProps["status"] }) => {
  switch (status) {
    case "success":
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Success</Badge>;
    case "pending":
      return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">Pending</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline" className="text-muted-foreground">Unknown</Badge>;
  }
};