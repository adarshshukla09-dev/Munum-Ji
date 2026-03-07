"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReceiptText } from "lucide-react";
import DebtTable from "./DebtTable";
import { getUdhar } from "@/server-actions/debt";

type Debt = {
  id: string;
  customerId: string;
  date: Date;
  product: string;
  qty: number;
  price: number;
  totalprice: number;
};

type Props = {
  customerId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function AllDebt({ customerId, open, setOpen }: Props) {
  const [data, setData] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebt = async () => {
      setLoading(true);

      const res = await getUdhar(customerId);
      const debts = res?.data || [];

      setData(debts);
      console.log("Fetched debts:", debts);

      setLoading(false);
    };

    if (customerId) {
      fetchDebt();
    }
  }, [customerId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center gap-2">
          <ReceiptText className="text-gray-600" size={22} />

          <div>
            <DialogTitle>Customer Debt</DialogTitle>

            <DialogDescription>
              All udhar records for customer:{" "}
              <span className="font-semibold">{customerId}</span>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading debts...</p>
          ) : (
            <DebtTable data={data} customerId={customerId} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}