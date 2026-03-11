"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, ReceiptText } from "lucide-react";
import DebtTable from "./DebtTable";
import { getUdhar } from "@/server-actions/debt";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "../ui/button";
import { directMessage, getReminderLinks } from "@/server-actions/whatsapp";
import { toast } from "sonner";

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

 const handleMessage = async () => {
  const res = await directMessage(customerId);

  if (res?.success && res.url) {
    window.open(res.url, "_blank");
  }
};

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
      <DialogContent className="max-w-7xl max-h-[90vh]  overflow-hidden">
        <DialogHeader className="flex flex-row items-center gap-2">
          <ReceiptText className="text-gray-600" size={22} />

          <div>
            <DialogTitle>Customer Debt</DialogTitle>

            <DialogDescription>
              All udhar records for customer:
              <span className="font-semibold">{customerId}</span>
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin h-4 w-4" />
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto border rounded-md">
              <DebtTable data={data} customerId={customerId} />
            </div>
          )}
        <div className="flex justify-end m-4 gap-2">
  <Button
    onClick={handleMessage}
    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2"
  >
    <FaWhatsapp size={18} />
    Send WhatsApp
  </Button>

 
</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
