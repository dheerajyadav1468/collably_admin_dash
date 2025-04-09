"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchAllProducts, deleteProduct, fetchBrandProducts, createProduct } from "../../app/store/prductSlice"
import { fetchAllBrands } from "../../app/store/brandSlice"
import Link from "next/link"
import { Filter, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"
import * as XLSX from "xlsx"

const ProductsTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { products, status, error } = useSelector((state: RootState) => state.products)
  const { brands } = useSelector((state: RootState) => state.brands)

  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    stockStatus: "",
    status: "",
    product: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [userType, setUserType] = useState<string | null>(null)
  const [brandId, setBrandId] = useState<string | null>(null)
  const [brandName, setBrandName] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10

  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"export" | "import">("export")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const brandId = localStorage.getItem("brandId")
    const brandName = localStorage.getItem("userName")

    setUserType(userType)
    setBrandId(brandId)
    setBrandName(brandName)

    if (userType === "admin") {
      dispatch(fetchAllProducts())
      dispatch(fetchAllBrands())
    } else if (userType === "brand" && brandId) {
      dispatch(fetchBrandProducts(brandId))
    }
  }, [dispatch])

  const handleViewClick = (productId: string) => {
    router.push(`/profileProduct?id=${productId}`)
  }

  const handleEditClick = (productId: string) => {
    router.push(`/productForm?id=${productId}`)
  }

  const handleDeleteClick = async (productId: string) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap()

      if (userType === "admin") {
        dispatch(fetchAllProducts())
      } else if (userType === "brand" && brandId) {
        dispatch(fetchBrandProducts(brandId))
      }

      alert("Product deleted successfully")
    } catch (error) {
      alert("Failed to delete product")
    }
  }

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const filteredProducts = products.filter((product) => {
    return (
      (!filters.brand || product.brandId === filters.brand) &&
      (!filters.category || product.category === filters.category) &&
      (!filters.stockStatus || (filters.stockStatus === "In Stock" ? product.quantity > 0 : product.quantity === 0)) &&
      (!filters.status || product.status === filters.status) &&
      (!filters.product || product.productname.toLowerCase().includes(filters.product.toLowerCase())) &&
      (!searchTerm || product.productname.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  // Helper function to get brand name from brand ID
  const getBrandNameById = (brandId: string) => {
    const brand = brands.find((b) => b._id === brandId)
    return brand ? brand.brandName : "Unknown Brand"
  }

  // Helper function to get brand ID from brand name
  const getBrandIdByName = (brandName: string) => {
    const brand = brands.find((b) => b.brandName.toLowerCase() === brandName.toLowerCase())
    return brand ? brand._id : ""
  }

  // Import/Export Functions
  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new()

    // Map products to a format suitable for export with brand name instead of ID
    const productsForExport = filteredProducts.map((product) => ({
      "Product Name": product.productname,
      "Brand Name": getBrandNameById(product.brandId),
      Description: product.description,
      Price: product.price,
      Quantity: product.quantity,
      Category: product.category,
      Status: product.status || "Draft",
    }))

    const worksheet = XLSX.utils.json_to_sheet(productsForExport)
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    saveAsExcelFile(excelBuffer, "products_export")

    setIsImportExportModalOpen(false)
    alert("Products have been exported to Excel")
  }

  const handleExportToCSV = () => {
    const workbook = XLSX.utils.book_new()

    // Map products to a format suitable for export with brand name instead of ID
    const productsForExport = filteredProducts.map((product) => ({
      "Product Name": product.productname,
      "Brand Name": getBrandNameById(product.brandId),
      Description: product.description,
      Price: product.price,
      Quantity: product.quantity,
      Category: product.category,
      Status: product.status || "Draft",
    }))

    const worksheet = XLSX.utils.json_to_sheet(productsForExport)
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

    // Generate CSV file
    const csvBuffer = XLSX.write(workbook, { bookType: "csv", type: "array" })
    saveAsCSVFile(csvBuffer, "products_export")

    setIsImportExportModalOpen(false)
    alert("Products have been exported to CSV")
  }

  const saveAsExcelFile = (buffer: ArrayBuffer, fileName: string) => {
    const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = window.URL.createObjectURL(data)
    const link = document.createElement("a")
    link.href = url
    link.download = `${fileName}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const saveAsCSVFile = (buffer: ArrayBuffer, fileName: string) => {
    const data = new Blob([buffer], { type: "text/csv" })
    const url = window.URL.createObjectURL(data)
    const link = document.createElement("a")
    link.href = url
    link.download = `${fileName}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Process and import each product
        let successCount = 0
        let failedCount = 0
        const totalProducts = jsonData.length

        for (const row of jsonData) {
          try {
            // Get brand ID from brand name
            const brandIdFromName = row["Brand Name"] ? getBrandIdByName(row["Brand Name"]) : ""
            // Use the found brand ID or fallback to the logged-in brand ID
            const resolvedBrandId = brandIdFromName || brandId || ""

            // Create FormData object for each product
            const productFormData = new FormData()
            productFormData.append("brandId", resolvedBrandId)
            productFormData.append("brandid", resolvedBrandId)
            productFormData.append("productname", row["Product Name"] || "")
            productFormData.append("description", row["Description"] || "")
            productFormData.append("price", (Number(row["Price"]) || 0).toString())
            productFormData.append("quantity", (Number(row["Quantity"]) || 0).toString())
            productFormData.append("category", row["Category"] || "")
            productFormData.append("status", row["Status"] || "Draft")

            await dispatch(createProduct(productFormData)).unwrap()
            successCount++
          } catch (error) {
            console.error("Failed to import product:", row, error)
            failedCount++
          }
        }

        // Update alert message to include failed count
        setIsImportExportModalOpen(false)
        alert(
          `${successCount} out of ${totalProducts} products imported successfully${failedCount > 0 ? `, ${failedCount} failed` : ""}`,
        )
      } catch (error) {
        console.error("Error processing file:", error)
        alert("There was an error processing the file")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  if (status === "loading") return <div>Loading...</div>
  if (status === "failed") return <div>Error: {error}</div>

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports"]

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="p-4 bg-dark text-gray rounded-lg w-full">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{userType === "admin" ? "All Products" : `${brandName}'s Products`}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsImportExportModalOpen(true)}
              className="flex items-center gap-2 rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Import/Export
            </button>
            <Link
              href="/productForm"
              className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
            <button
              onClick={toggleFilters}
              className={`flex items-center gap-2 rounded px-4 py-2 hover:bg-gray-200 ${
                showFilters ? "bg-gray-200" : "bg-gray-100"
              } text-gray-700`}
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-5">
            {userType === "admin" && (
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full rounded-md border p-2 bg-black text-gray"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.brandName}
                  </option>
                ))}
              </select>
            )}

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full rounded-md border p-2 bg-black text-gray"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filters.stockStatus}
              onChange={(e) => handleFilterChange("stockStatus", e.target.value)}
              className="w-full rounded-md border p-2 bg-black text-gray"
            >
              <option value="">All Stock Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full rounded-md border p-2 bg-black text-gray"
            >
              <option value="">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        )}

        <div className="relative mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name"
            className="w-full rounded-md border bg-black p-2 pl-10"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">Product</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Category</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Price</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Stock Status</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Status</th>
                <th className="hidden px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base sm:table-cell">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, key) => (
                <tr
                  key={product._id}
                  className={key === currentProducts.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"}
                >
                  <td className="flex items-center gap-3.5 px-2 py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                      {product.productname ? product.productname.charAt(0).toUpperCase() : ""}
                    </div>
                    <p className="hidden font-medium text-dark dark:text-white sm:block">{product.productname}</p>
                  </td>
                  <td className="px-2 py-4 text-center font-medium text-dark dark:text-white">{product.category}</td>
                  <td className="px-2 py-4 text-center font-medium text-green-light-1">₹{product.price}</td>
                  <td className="px-2 py-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        product.quantity > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        product.status === "Published" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-center sm:table-cell">
                    <button className="hover:text-primary" onClick={() => handleViewClick(product._id)}>
                    <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.99935 6.87492C8.27346 6.87492 6.87435 8.27403 6.87435 9.99992C6.87435 11.7258 8.27346 13.1249 9.99935 13.1249C11.7252 13.1249 13.1243 11.7258 13.1243 9.99992C13.1243 8.27403 11.7252 6.87492 9.99935 6.87492ZM8.12435 9.99992C8.12435 8.96438 8.96382 8.12492 9.99935 8.12492C11.0349 8.12492 11.8743 8.96438 11.8743 9.99992C11.8743 11.0355 11.0349 11.8749 9.99935 11.8749C8.96382 11.8749 8.12435 11.0355 8.12435 9.99992Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.99935 2.70825C6.23757 2.70825 3.70376 4.96175 2.23315 6.8723L2.20663 6.90675C1.87405 7.3387 1.56773 7.73652 1.35992 8.20692C1.13739 8.71064 1.04102 9.25966 1.04102 9.99992C1.04102 10.7402 1.13739 11.2892 1.35992 11.7929C1.56773 12.2633 1.87405 12.6611 2.20664 13.0931L2.23316 13.1275C3.70376 15.0381 6.23757 17.2916 9.99935 17.2916C13.7611 17.2916 16.2949 15.0381 17.7655 13.1275L17.792 13.0931C18.1246 12.6612 18.431 12.2633 18.6388 11.7929C18.8613 11.2892 18.9577 10.7402 18.9577 9.99992C18.9577 9.25966 18.8613 8.71064 18.6388 8.20692C18.431 7.73651 18.1246 7.33868 17.792 6.90673L17.7655 6.8723C16.2949 4.96175 13.7611 2.70825 9.99935 2.70825ZM3.2237 7.63475C4.58155 5.87068 6.79132 3.95825 9.99935 3.95825C13.2074 3.95825 15.4172 5.87068 16.775 7.63475C17.1405 8.10958 17.3546 8.3933 17.4954 8.71204C17.627 9.00993 17.7077 9.37403 17.7077 9.99992C17.7077 10.6258 17.627 10.9899 17.4954 11.2878C17.3546 11.6065 17.1405 11.8903 16.775 12.3651C15.4172 14.1292 13.2074 16.0416 9.99935 16.0416C6.79132 16.0416 4.58155 14.1292 3.2237 12.3651C2.85821 11.8903 2.64413 11.6065 2.50332 11.2878C2.37171 10.9899 2.29102 10.6258 2.29102 9.99992C2.29102 9.37403 2.37171 9.00993 2.50332 8.71204C2.64413 8.3933 2.85821 8.10958 3.2237"
                      fill=""
                    />
                  </svg>
                    </button>
                    {userType === "admin" || (userType === "brand" && brandId) ? (
                      <>
                        <button className="hover:text-primary ml-2" onClick={() => handleEditClick(product._id)}>
                        <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.0758 2.99996C17.4654 2.38996 16.4796 2.38996 15.8691 2.99996L14.6059 4.26329L17.7366 7.39396L19 6.13063C19.61 5.52063 19.61 4.53479 19 3.92479L18.0758 2.99996Z"
                      fill=""
                    />
                    <path
                      d="M2.92969 15.9393V19.0702H6.06036L16.3561 8.77441L13.2254 5.64374L2.92969 15.9393Z"
                      fill=""
                    />
                  </svg>
                        </button>
                        <button className="hover:text-red-500 ml-2" onClick={() => handleDeleteClick(product._id)}>
                        <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.59048 1.87502H11.4084C11.5887 1.8749 11.7458 1.8748 11.8941 1.89849C12.4802 1.99208 12.9874 2.35762 13.2615 2.88403C13.3309 3.01727 13.3805 3.16634 13.4374 3.33745L13.5304 3.61654C13.5461 3.66378 13.5506 3.67715 13.5545 3.68768C13.7004 4.09111 14.0787 4.36383 14.5076 4.3747C14.5189 4.37498 14.5327 4.37503 14.5828 4.37503H17.0828C17.4279 4.37503 17.7078 4.65485 17.7078 5.00003C17.7078 5.34521 17.4279 5.62503 17.0828 5.62503H2.91602C2.57084 5.62503 2.29102 5.34521 2.29102 5.00003C2.29102 4.65485 2.57084 4.37503 2.91602 4.37503H5.41609C5.46612 4.37503 5.47993 4.37498 5.49121 4.3747C5.92009 4.36383 6.29844 4.09113 6.44437 3.6877C6.44821 3.67709 6.45262 3.66401 6.46844 3.61654L6.56145 3.33747C6.61836 3.16637 6.66795 3.01728 6.73734 2.88403C7.01146 2.35762 7.51862 1.99208 8.1047 1.89849C8.25305 1.8748 8.41016 1.8749 8.59048 1.87502ZM7.50614 4.37503C7.54907 4.29085 7.5871 4.20337 7.61983 4.1129C7.62977 4.08543 7.63951 4.05619 7.65203 4.01861L7.7352 3.7691C7.81118 3.54118 7.82867 3.49469 7.84602 3.46137C7.9374 3.2859 8.10645 3.16405 8.30181 3.13285C8.33892 3.12693 8.38854 3.12503 8.6288 3.12503H11.37C11.6103 3.12503 11.6599 3.12693 11.697 3.13285C11.8924 3.16405 12.0614 3.2859 12.1528 3.46137C12.1702 3.49469 12.1876 3.54118 12.2636 3.7691L12.3468 4.01861C12.3593 4.05619 12.3691 4.08543 12.379 4.1129C12.4117 4.20337 12.4498 4.29085 12.4927 4.37503H7.50614ZM4.91602 7.50003C5.26121 7.50003 5.54102 7.77985 5.54102 8.12503V15.0417C5.54102 16.0542 6.36188 16.875 7.37435 16.875H12.6243C13.6368 16.875 14.4577 16.0542 14.4577 15.0417V8.12503C14.4577 7.77985 14.7375 7.50003 15.0827 7.50003C15.4279 7.50003 15.7077 7.77985 15.7077 8.12503V15.0417C15.7077 16.7442 14.3268 18.125 12.6243 18.125H7.37435C5.67188 18.125 4.29102 16.7442 4.29102 15.0417V8.12503C4.29102 7.77985 4.57084 7.50003 4.91602 7.50003Z"
                      fill=""
                    />
                  </svg>
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
              {filteredProducts.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span>
                {currentPage} of {Math.ceil(filteredProducts.length / productsPerPage)}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastProduct >= filteredProducts.length}
                className="p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Import/Export Modal */}
      {isImportExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-dark rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Import/Export Products</h3>
              <button onClick={() => setIsImportExportModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-4">
              <div className="flex border-b">
                <button
                  className={`py-2 px-4 ${activeTab === "export" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                  onClick={() => setActiveTab("export")}
                >
                  Export
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === "import" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                  onClick={() => setActiveTab("import")}
                >
                  Import
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "export" ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Export your products to Excel or CSV format. This will export all products currently displayed in the
                  table.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleExportToExcel}
                    className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Export to Excel
                  </button>
                  <button
                    onClick={handleExportToCSV}
                    className="flex items-center gap-2 rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Export to CSV
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Import products from Excel or CSV file. The file should have columns for Product Name, Brand Name,
                  Description, Price, Quantity, Category, and Status.
                </p>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload File</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 w-full justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Select File
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsTable
