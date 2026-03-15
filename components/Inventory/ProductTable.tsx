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
import { Button } from "../ui/button"
import { deleteProduct, updateinventory } from "@/server-actions/inventory"
import EditPage from "./EditPage"
import { addNotification } from "@/server-actions/notifications"
import { toast } from "sonner"
import { useEffect } from "react"

type Product = {
  id: string
  userId: string
  productName: string
  stock: number
  price: number
}
const addnoti = async(name:string)=>{
  const newNoti = await addNotification({
    name:name,
    type:"inventory",
    message:"you have less stock ,only 5 are remaing "

  })
  toast.error(`few stock of ${name}`)
}
function ProductTable({ data }: { data: Product[] }) {
useEffect(() => {
  data.forEach((item) => {
    if (item.stock <= 5) {
      addnoti(item.productName)
    }
  })
}, [data])
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
                ₹{item.price}
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
            <TableCell className="font-bold" >
              ₹{total}
            </TableCell>
          </TableRow>
        </TableFooter>

      </Table>
    </div>
  )
}

export default ProductTable