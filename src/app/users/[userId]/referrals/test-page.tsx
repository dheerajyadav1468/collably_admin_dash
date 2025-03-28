"use client"

import { useParams } from "next/navigation"

export default function TestPage() {
  const params = useParams()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <p>User ID: {params.userId}</p>
    </div>
  )
}

