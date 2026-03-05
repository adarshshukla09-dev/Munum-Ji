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
import { deleteUdhar } from "@/server-actions/debt";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
type data=  {
    id: string;
    customerId: string;
    date: Date;
    product: string;
    qty: number;
    price: number;
    totalprice: number;
}
type DebtTableProps = {
  data?: data[];
};

function DebtTable({ data }: DebtTableProps) {
      return (
    <div className="m-4 mt-6 max-w-7xl  border-2 p-3 rounded-3xl">
      <Table>
        <TableCaption>A list of your recent products.</TableCaption>

        <TableHeader className="font-bold justify-between">
          <TableRow>
            <TableHead >date</TableHead>
            <TableHead >product</TableHead>
            <TableHead>qty</TableHead>
            <TableHead>price</TableHead>
            <TableHead>totalprice</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data && data.map((item) => ( 
            <TableRow key={item.id} className="hover:bg-gray-200">
             
              <TableCell className="font-medium" >{item.date.toLocaleDateString()}</TableCell>
              <TableCell>{item.product}</TableCell>
              <TableCell>${item.qty}</TableCell>
              <TableCell>${item.price}</TableCell>
              <TableCell>${item.totalprice}</TableCell>
              <TableCell className="flex gap-2">
               <span>
                   <Button onClick={()=>{deleteUdhar(item.id)} }>
                    <Trash2 />
                  </Button>
                </span>
              {/* < item={item}/> */}
              </TableCell>
            </TableRow>
          ))}
                     
        </TableBody>

       
      </Table>
    </div>
  )
}

export default DebtTable
