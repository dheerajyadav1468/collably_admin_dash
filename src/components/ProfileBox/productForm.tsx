"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchProduct, updateProduct, createProduct } from "../../app/store/prductSlice"
import { fetchAllBrands } from "../../app/store/brandSlice"
import type { Product } from "../../app/store/prductSlice"
import type { Brand } from "../../app/store/brandSlice"
import ProductModal from "./modalProduct"
import Select from "react-select"
import Image from "next/image"

const ProductForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("id")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    currentProduct,
    status: productStatus,
    error: productError,
  } = useSelector((state: RootState) => state.products)
  const { brands, status: brandsStatus } = useSelector((state: RootState) => state.brands)

  const [formData, setFormData] = useState<Partial<Product>>({
    brandId: "",
    productname: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    status: "Draft",
  })

  const [productPhotos, setProductPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const MAX_PHOTOS = 5
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loggedInBrandId, setLoggedInBrandId] = useState<string | null>(null)

  useEffect(() => {
    const role = localStorage.getItem("userType")
    setUserRole(role)
    console.log(role)
    const brandId = localStorage.getItem("brandId")
    setLoggedInBrandId(brandId)

    if (role !== "admin") {
      setFormData((prev) => ({ ...prev, brandId: brandId || "" }))
    }

    dispatch(fetchAllBrands())
    if (productId) {
      dispatch(fetchProduct(productId))
    }
  }, [dispatch, productId])

  useEffect(() => {
    if (currentProduct && productId) {
      setFormData({
        brandId: currentProduct.brandId,
        productname: currentProduct.productname,
        description: currentProduct.description,
        price: currentProduct.price,
        quantity: currentProduct.quantity,
        category: currentProduct.category,
        status: currentProduct.status || "Draft",
      })

      // If the product has photo URLs, set them as previews
      if (currentProduct.photoUrls && currentProduct.photoUrls.length > 0) {
        setPhotoPreviews(currentProduct.photoUrls)
      } else if (currentProduct.photoUrl) {
        setPhotoPreviews([currentProduct.photoUrl])
      }
    }
  }, [currentProduct, productId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? (value === "" ? 0 : Number(value)) : value,
    }))
  }

  const handleSelectChange = (selectedOption: any) => {
    if (userRole === "admin") {
      setFormData((prev) => ({
        ...prev,
        brandId: selectedOption ? selectedOption.value : "",
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const totalPhotos = productPhotos.length + files.length

      if (totalPhotos > MAX_PHOTOS) {
        alert(`You can only upload a maximum of ${MAX_PHOTOS} photos.`)
        return
      }

      setProductPhotos((prev) => [...prev, ...files])

      // Create preview URLs for new files
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPhotoPreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemovePhoto = (index: number) => {
    setProductPhotos((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Create FormData object
    const productFormData = new FormData()

    // Add all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        productFormData.append(key, value.toString())
      }
    })

    // Add photos if selected - use productPhoto as the key (not productPhotos)
    if (productPhotos.length > 0) {
      productPhotos.forEach((photo) => {
        productFormData.append("productPhoto", photo)
      })
    }

    try {
      if (productId) {
        await dispatch(updateProduct({ id: productId, productData: productFormData })).unwrap()
        setModalMessage("Product updated successfully")
      } else {
        await dispatch(createProduct(productFormData)).unwrap()
        setModalMessage("Product created successfully")
      }
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error:", error)
      alert(productId ? "Failed to update product" : "Failed to create product")
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    router.push("/productTable")
  }

  if (productStatus === "loading" || brandsStatus === "loading") return <div>Loading...</div>
  if (productStatus === "failed") return <div>Error: {productError}</div>

  const brandOptions = brands.map((brand: Brand) => ({
    value: brand._id,
    label: brand.brandName,
  }))

  return (
    <div className="max-w-6xl p-8 bg-white rounded-lg shadow-lg dark:bg-gray-dark space-y-6">
      <h4 className="text-3xl font-semibold text-dark dark:text-white mb-6">
        {productId ? "Update Product" : "Add New Product"}
      </h4>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="productname" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="productname"
              name="productname"
              value={formData.productname}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none bg-dark focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="brandId" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Brand
            </label>
            <Select
              id="brandId"
              name="brandId"
              value={
                userRole === "admin"
                  ? brandOptions.find((option) => option.value === formData.brandId) || null
                  : brandOptions.find((option) => option.value === loggedInBrandId) || null
              }
              onChange={handleSelectChange}
              options={
                userRole === "admin" ? brandOptions : brandOptions.filter((option) => option.value === loggedInBrandId)
              }
              isDisabled={userRole !== "admin"}
              className="w-full p-2.5 border-2 border-gray-300 rounded-lg focus:outline-none bg-dark focus:ring-2 focus:ring-indigo-500"
              classNamePrefix="react-select"
              placeholder="Select Brand"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="description" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price ?? ""}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity ?? ""}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              min="0"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home</option>
              <option value="Beauty">Beauty</option>
              <option value="Sports">Sports</option>
              <option value="Food">Food</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div className="col-span-2">
            <label htmlFor="productPhoto" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Product Photos (Max 5)
            </label>
            <div className="flex flex-col space-y-4">
              {photoPreviews.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative w-40 h-40">
                      <Image
                        src={preview || "/placeholder.svg"}
                        alt={`Product preview ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {photoPreviews.length < MAX_PHOTOS && (
                <>
                  <input
                    type="file"
                    id="productPhoto"
                    name="productPhoto"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="w-full p-3 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload product images (JPG, PNG, GIF up to 5MB each) - {photoPreviews.length}/{MAX_PHOTOS} photos
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-full md:w-1/3 py-4 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {productId ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>

      <ProductModal isOpen={isModalOpen} onClose={handleModalClose}>
        <h2 className="text-xl font-bold mb-4">Success!</h2>
        <p>{modalMessage}</p>
      </ProductModal>
    </div>
  )
}

export default ProductForm
