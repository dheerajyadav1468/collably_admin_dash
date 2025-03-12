"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store/store"
import { fetchProduct } from "../store/prductSlice"
import { fetchUser } from "../store/userSlice"
import { API_ROUTES } from "../apiroutes"
import { ArrowLeft, Package, User, CreditCard, Truck, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand";

interface OrderItem {
  product: string | null
  quantity: number
  price: number
  _id: string
  productname?: string
}

interface Order {
  _id: string
  user: string
  items: OrderItem[]
  totalAmount: number
  shippingAddress: string
  paymentStatus: string
  orderStatus: string
  createdAt: string
  updatedAt: string
}

interface ProductDetails {
  _id: string
  productname: string
  description: string
  price: number
  category: string
  brandId: string
}

interface UserDetails {
  _id: string
  fullname: string
  username: string
  email: string
  contactNumber: string
  address: string
}

export default function OrderDetails() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [productDetails, setProductDetails] = useState<{ [key: string]: ProductDetails }>({})

  const { currentUser } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    if (!orderId) return

    const fetchOrderDetails = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        const response = await fetch(API_ROUTES.GET_ORDER(orderId), {
          headers: {
            Authorization: token,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }

        const data = await response.json()
        setOrder(data.order)

        // Fetch user details
        if (data.order.user) {
          dispatch(fetchUser(data.order.user))
        }

        // Fetch product details for each item
        for (const item of data.order.items) {
          if (item.product) {
            const productResponse = await dispatch(fetchProduct(item.product))
            if (productResponse.payload) {
              setProductDetails((prev) => ({
                ...prev,
                [item.product as string]: productResponse.payload,
              }))
            }
          }
        }
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, dispatch])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  if (loading) {
    return (
      <DefaultLayoutBrand>
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-lg">Loading order details...</p>
        </div>
      </div>
      </DefaultLayoutBrand>
    )
  }

  if (error) {
    return (
      <DefaultLayoutBrand>
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md rounded-lg bg-red-50 p-6 text-center">
          <h2 className="mb-2 text-xl font-bold text-red-700">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
          </DefaultLayoutBrand>
    )
  }

  if (!order) {
    return (
      <DefaultLayoutBrand>
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md rounded-lg bg-yellow-50 p-6 text-center">
          <h2 className="mb-2 text-xl font-bold text-yellow-700">Order Not Found</h2>
          <p className="text-yellow-600">The requested order could not be found.</p>
          <button
            onClick={() => router.push("/orders")}
            className="mt-4 rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            View All Orders
          </button>
        </div>
      </div>
      </DefaultLayoutBrand>
    )
  }

  return (
        <DefaultLayoutBrand>
    
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center">
        <button onClick={() => router.back()} className="mr-4 flex items-center text-gray-600 hover:text-primary">
          <ArrowLeft className="mr-2 h-5 w-5" />
          
        </button>
        <h1 className="text-2xl font-bold md:text-3xl">Order Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Summary */}
        <div className="md:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Order ID {order._id}</h2>
              <div className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="flex items-start">
                <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Order Time</p>
                  <p className="font-medium">{formatTime(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <CreditCard className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p
                    className={`font-medium ${
                      order.paymentStatus.toLowerCase() === "paid" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Truck className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Delivery Status</p>
                  <p className="font-medium">{order.orderStatus}</p>
                </div>
              </div>
            </div>

            <h3 className="mb-3 text-lg font-semibold">Order Items</h3>
            <div className="mb-6 overflow-x-auto">
              <table className="w-full min-w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Quantity</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => {
                    const product = item.product ? productDetails[item.product] : null
                    return (
                      <tr key={item._id} className="border-b">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <Image
                                src="/placeholder.svg"
                                alt={product?.productname || "Product"}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {product?.productname || item.productname || "Unknown Product"}
                              </div>
                              {product && <div className="text-sm text-gray-500">{product.category}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">₹{item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-medium">₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-medium">
                    <td colSpan={3} className="px-4 py-3 text-right">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right text-lg font-bold">₹{order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <h3 className="mb-3 text-lg font-semibold">Shipping Address</h3>
            <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
              <p className="whitespace-pre-line">{order.shippingAddress}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
            <h2 className="mb-4 text-xl font-semibold">Customer Information</h2>

            {currentUser ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-primary text-center text-lg font-bold text-white flex items-center justify-center">
                    {currentUser.fullname.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{currentUser.fullname}</p>
                    <p className="text-sm text-gray-500">@{currentUser.username}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="mb-2 flex items-start">
                    <User className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Contact Information</p>
                      <p className="font-medium">{currentUser.email}</p>
                      {currentUser.contactNumber && <p className="font-medium">{currentUser.contactNumber}</p>}
                    </div>
                  </div>

                  {currentUser.address && (
                    <div className="flex items-start">
                      <Package className="mr-2 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Default Address</p>
                        <p className="font-medium">{currentUser.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/user?id=${currentUser._id}`}
                    className="inline-flex items-center text-primary hover:text-primary/80"
                  >
                    View Customer Profile
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-gray-50 p-4 text-center dark:bg-gray-800">
                <p>Loading customer information...</p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
            <h2 className="mb-4 text-xl font-semibold">Order Timeline</h2>
            <div className="space-y-4">
              <div className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  <div className="h-full w-0.5 bg-gray-300"></div>
                </div>
                <div>
                  <p className="font-medium">Order Placed</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div
                    className={`h-4 w-4 rounded-full ${order.paymentStatus.toLowerCase() === "paid" ? "bg-green-500" : "bg-yellow-500"}`}
                  ></div>
                  <div className="h-full w-0.5 bg-gray-300"></div>
                </div>
                <div>
                  <p className="font-medium">Payment {order.paymentStatus}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div
                    className={`h-4 w-4 rounded-full ${
                      order.orderStatus.toLowerCase() === "completed"
                        ? "bg-green-500"
                        : order.orderStatus.toLowerCase() === "pending"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                    }`}
                  ></div>
                </div>
                <div>
                  <p className="font-medium">Order {order.orderStatus}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        </DefaultLayoutBrand>
    
  )
}

