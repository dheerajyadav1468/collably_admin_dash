"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card/cardBrand"

export function PopularCustomer() {
  return (
    <Card className="dark:bg-gray-dark w-[50%]"  >
      <CardHeader>
        <div className="border-l-4 border-gray-400 pl-4 text-white">
          <CardTitle>POPULAR CUSTOMER</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-white">No data found.</p>
      </CardContent>
    </Card>
  )
}

