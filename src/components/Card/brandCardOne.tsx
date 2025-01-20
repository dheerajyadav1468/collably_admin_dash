"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card/cardBrand"

export function MostSoldProducts() {
  return (
    <Card className="w-[50%] mb-4 mt-3 dark:bg-gray-dark ">
      <CardHeader>
        <div className="border-l-4 border-gray-400 pl-4 text-white">
          <CardTitle>MOST SOLD PRODUCTS</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-white">No data found.</p>
      </CardContent>
    </Card>
  )
}

