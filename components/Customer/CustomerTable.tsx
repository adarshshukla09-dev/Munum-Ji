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

import { Button } from "../ui/button";
import { Trash2, Eye, PlusCircle } from "lucide-react";
import EditCustomer from "./EditCustomer";
import { deleteUser } from "@/server-actions/customer";
import CreateCustomer from "./CreateCustomer";
import AllDebt from "../Debt/AllDebt";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { createAllPaymentLinks } from "@/server-actions/whatsapp";

type CustomerInput = {
  id: string;
  name: string;
  phoneNo: string;
  address: string;
  ledger:number;
};

type Props = {
  data: CustomerInput[];
};

function CustomerTable({ data }: Props) {
  const [customerId, setCustomerId] = useState<string | null>(null);

  const handleViewDebt = (id: string) => {
    setCustomerId(id);
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
  };
const sendBulkReminder = async () => {
  const links = await createAllPaymentLinks();

  if (!links.length) {
    toast.error("No customers with debt");
    return;
  }

  toast.success(`Opening ${links.length} WhatsApp chats`);

  links.forEach((link, i) => {
    setTimeout(() => {
      window.open(link.whatsappLink, "_blank");
    }, i * 1500); // safer delay
  });
};
  return (
    <div className="m-6 max-w-7xl rounded-2xl border bg-white shadow-sm">
      {/* Header */}
    <div className="flex items-center border-b p-5">
  <h2 className="text-xl font-semibold">Customers</h2>

  <div className="ml-auto flex gap-3">
    <CreateCustomer />

    <Button
      onClick={sendBulkReminder}
      className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2"
    >
      <FaWhatsapp size={18} />
      Send All Reminders
    </Button>
  </div>
</div>
      {/* Table */}
      <div className="p-4">
        <Table>
          <TableCaption className="text-gray-500">
            Manage your customer list and view their debts
          </TableCaption>

          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Customer ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>ledger</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                className="transition hover:bg-gray-50"
              >
                <TableCell className="font-medium text-gray-700">
                  {item.id}
                </TableCell>

                <TableCell className="font-semibold">
                  {item.name}
                </TableCell>

                <TableCell>{item.phoneNo}</TableCell>

                <TableCell className="max-w-50 truncate">
                  {item.address}
                </TableCell>
                <TableCell className="font-bold text-red-500">₹{item.ledger}</TableCell>

                <TableCell className="flex justify-end gap-2">
                  
                  {/* View Debt */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleViewDebt(item.id)}
                  >
                    <PlusCircle size={18} />
                
                  </Button>

                  {/* Edit */}
                  <EditCustomer item={item} />

                  {/* Delete */}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={18} />
                  </Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Debt Modal */}
      {customerId && (
        
        <AllDebt
          customerId={customerId}
          open={true}
          setOpen={() => setCustomerId(null)}
        />
      )}
    </div>
  );
}

export default CustomerTable;