"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAllProduct } from "@/server-actions/inventory"


 const allProduct = await getAllProduct();
  const data = allProduct.data ?? [];

const inventory = () => {
  return (
      <Table >
        <TableCaption>A list of your recent products.</TableCaption>

        <TableHeader className="font-bold justify-between">
          <TableRow>
            <TableHead className="w-1/4">Sr No</TableHead>
            <TableHead className="w-1/4">Product Name</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id} className="hover:bg-gray-200">
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">
                {item.productName}
              </TableCell>
              <TableCell>{item.stock}</TableCell>
              <TableCell>
                ₹{item.price}
              </TableCell>
             
            </TableRow>
          ))}
        </TableBody>

      

      </Table>
  )
}

export default inventory
