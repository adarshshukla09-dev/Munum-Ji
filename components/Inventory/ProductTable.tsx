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
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { deleteProduct, updateinventory } from "@/server-actions/inventory"
import EditPage from "./EditPage"

type Product = {
  id: string
  userId: string
  productName: string
  stock: number
  price: number
}

function ProductTable({ data }: { data: Product[] }) {

  const total = data.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="m-4 mt-6 max-w-7xl  border-2 p-3 rounded-3xl">
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
                ${item.price}
              </TableCell>
             <TableCell className="flex gap-2">
               <span><Button onClick={()=>deleteProduct(item.id.toString())} ><Trash2/></Button></span>
<EditPage item={item}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell >
              ${total}
            </TableCell>
          </TableRow>
        </TableFooter>

      </Table>
    </div>
  )
}

export default ProductTable