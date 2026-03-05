"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateCustomerInput, CreateUdharInput } from "@/lib/validations";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import EditCustomer from "./EditCustomer";
import { deleteUser } from "@/server-actions/customer";
type CustomerInput= {
  id:string;
    name: string;
    phoneNo: string;
    address: string;
}
function DebtTable(data:CustomerInput[]) {

  return (
    <div className="m-4 mt-6 max-w-7xl  border-2 p-3 rounded-3xl">
      <Table>
        <TableCaption>A list of your recent products.</TableCaption>

        <TableHeader className="font-bold justify-between">
          <TableRow>
            <TableHead className="w-1/4">CustomerId</TableHead>
            <TableHead className="w-1/4">customerName</TableHead>
            <TableHead>phoneno</TableHead>
            <TableHead>address</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => ( 
            <TableRow key={item.id} className="hover:bg-gray-200">
             
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>${item.phoneNo}</TableCell>
              <TableCell>${item.address}</TableCell>
              <TableCell className="flex gap-2">
               <span>
                   <Button onClick={()=>{deleteUser(item.id)} }>
                    <Trash2 />
                  </Button>
                </span>
              <EditCustomer item={item}/>
              </TableCell>
            </TableRow>
          ))}
                     
        </TableBody>

       
      </Table>
    </div>
  );
}

export default DebtTable
