"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchAllProducts, fetchBrandProducts } from "../../app/store/prductSlice"
import { fetchAllBrands } from "../../app/store/brandSlice"
import Link from "next/link"
import { Filter, ArrowLeft, Search, ChevronLeft, ChevronRight, Download } from "lucide-react"
import * as XLSX from "xlsx"

export default function ExportProductsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { products, status, error } = useSelector((state: RootState) => state.products)
  const { brands } = useSelector((state: RootState) => state.brands)

  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    stockStatus: "",
    status: "",
    product: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [userType, setUserType] = useState<string | null>(null)
  const [brandId, setBrandId] = useState<string | null>(null)
  const [brandName, setBrandName] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10
  const [exportFormat, setExportFormat] = useState<"excel" | "csv">("excel")

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

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const filteredProducts = products.filter((product) => {
    return (
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

  const handleExport = () => {
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

    // Generate file based on selected format
    if (exportFormat === "excel") {
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      saveAsFile(
        excelBuffer,
        "products_export.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      )
    } else {
      const csvBuffer = XLSX.write(workbook, { bookType: "csv", type: "array" })
      saveAsFile(csvBuffer, "products_export.csv", "text/csv")
    }

    alert(`Products have been exported to ${exportFormat === "excel" ? "Excel" : "CSV"}`)
  }

  const saveAsFile = (buffer: ArrayBuffer, fileName: string, mimeType: string) => {
    const data = new Blob([buffer], { type: mimeType })
    const url = window.URL.createObjectURL(data)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(url)
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
          <div className="flex items-center gap-4">
            <Link href="/products" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
              Back to Products
            </Link>
            <h1 className="text-2xl font-bold">
              {userType === "admin" ? "Export All Products" : `Export ${brandName}'s Products`}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Export Products
            </button>
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

        <div className="mb-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="excel"
                name="exportFormat"
                value="excel"
                checked={exportFormat === "excel"}
                onChange={() => setExportFormat("excel")}
                className="h-4 w-4"
              />
              <label htmlFor="excel" className="text-sm font-medium">
                Excel (.xlsx)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="csv"
                name="exportFormat"
                value="csv"
                checked={exportFormat === "csv"}
                onChange={() => setExportFormat("csv")}
                className="h-4 w-4"
              />
              <label htmlFor="csv" className="text-sm font-medium">
                CSV (.csv)
              </label>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
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
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {filteredProducts.length} products will be exported. Use the filters above to refine your export.
            </p>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">Product</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Category</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Price</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Stock Status</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Status</th>
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
    </div>
  )
}

