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
    <div className="m-4 mt-6 max-w-7xl border-2 p-3 rounded-3xl">
      <Table >
        <TableCaption>A list of your recent products.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Sr No</TableHead>
            <TableHead className="w-1/4">Product Name</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">
                {item.productName}
              </TableCell>
              <TableCell>{item.stock}</TableCell>
              <TableCell className="text-right">
                ${item.price}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              ${total}
            </TableCell>
          </TableRow>
        </TableFooter>

      </Table>
    </div>
  )
}

export default ProductTable