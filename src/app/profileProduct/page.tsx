"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchProduct } from "../../app/store/prductSlice"
import Link from "next/link"

const ProfileProduct = () => {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get("id")
  const { currentProduct, status, error } = useSelector((state: RootState) => state.products)

  useEffect(() => {
    if (productId) {
      dispatch(fetchProduct(productId))
    }
  }, [dispatch, productId])

  const handleEditClick = () => {
    if (productId) {
      router.push(`/productForm?id=${productId}`)
    }
  }

  if (status === "loading") return <div>Loading...</div>
  if (status === "failed") return <div>Error: {error}</div>
  if (!currentProduct) return <div>No product found</div>

  return (
    <div className="p-6 max-w-6xl bg-white dark:bg-gray-dark rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-dark dark:text-white">{currentProduct.productname} - Product Details</h2>
        <button
          onClick={handleEditClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Edit Product
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Product Information</h3>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg mb-2">
            {currentProduct.productname ? currentProduct.productname.charAt(0).toUpperCase() : ""}
          </div>
          <p>
            <strong>Name:</strong> {currentProduct.productname}
          </p>
          <p>
            <strong>Category:</strong> {currentProduct.category}
          </p>
          <p>
            <strong>Description:</strong> {currentProduct.description}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Product Details</h3>
          <p>
            <strong>Price:</strong> ${currentProduct.price}
          </p>
          <p>
            <strong>Quantity:</strong> {currentProduct.quantity}
          </p>
          <p>
            <strong>Status:</strong> {currentProduct.status}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <Link href={`/profileBrand?id=${currentProduct.brandId}`} className="text-blue-500 hover:text-blue-700">
          View Brand Details
        </Link>
      </div>
    </div>
  )
}

export default ProfileProduct

