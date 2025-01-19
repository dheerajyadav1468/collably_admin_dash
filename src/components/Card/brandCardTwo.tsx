"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card/cardBrand"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Card/Table"

const brands = [
  { name: "Samsung", total: 2 },
  { name: "LG Brand", total: 2 },
  { name: "Walton", total: 1 },
  { name: "Canon", total: 1 },
  { name: "Huawei", total: 1 },
]

export function MostSoldBrands() {
  return (
    <Card className="mb-3 dark:bg-gray-dark w-[48%]">
      <CardHeader>
        <div className="border-l-4 border-white-400 pl-4 text-white">
          <CardTitle>MOST SOLD BRANDS</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead  className="text-white">Brand</TableHead>
              <TableHead className="text-right text-white">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.name}>
                <TableCell className="text-white">{brand.name}</TableCell>
                <TableCell className="text-right text-white">{brand.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

