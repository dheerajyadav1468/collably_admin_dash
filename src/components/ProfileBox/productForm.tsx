"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchProduct, updateProduct, createProduct } from "../../app/store/prductSlice"
import { fetchAllBrands } from "../../app/store/brandSlice"
import type { Product } from "../../app/store/prductSlice"
import type { Brand } from "../../app/store/brandSlice"
import ProductModal from "./modalProduct"
import Select from "react-select"

const ProductForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("id")

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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")

  useEffect(() => {
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
    setFormData((prev) => ({
      ...prev,
      brandId: selectedOption ? selectedOption.value : "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (productId) {
        await dispatch(updateProduct({ id: productId, productData: formData })).unwrap()
        setModalMessage("Product updated successfully")
      } else {
        await dispatch(createProduct(formData as Omit<Product, "_id">)).unwrap()
        setModalMessage("Product created successfully")
      }
      setIsModalOpen(true)
    } catch (error) {
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
              value={brandOptions.find((option) => option.value === formData.brandId) || null}
              onChange={handleSelectChange}
              options={brandOptions}
              isClearable
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

