"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchAllProducts, fetchBrandProducts, createProduct } from "../../app/store/prductSlice"
import { fetchAllBrands } from "../../app/store/brandSlice"
import Link from "next/link"
import { ArrowLeft, Upload, FileText } from "lucide-react"
import * as XLSX from "xlsx"

export default function ImportProductsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { products, status, error } = useSelector((state: RootState) => state.products)
  const { brands } = useSelector((state: RootState) => state.brands)

  const [userType, setUserType] = useState<string | null>(null)
  const [brandId, setBrandId] = useState<string | null>(null)
  const [brandName, setBrandName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<{
    total: number
    success: number
    failed: number
    inProgress: boolean
  }>({
    total: 0,
    success: 0,
    failed: 0,
    inProgress: false,
  })
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

  // Helper function to get brand ID from brand name
  const getBrandIdByName = (brandName: string) => {
    const brand = brands.find((b) => b.brandName.toLowerCase() === brandName.toLowerCase())
    return brand ? brand._id : ""
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    parseFile(selectedFile)
  }

  const parseFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        setPreviewData(jsonData.slice(0, 5)) // Preview first 5 rows
        setImportStatus({
          total: jsonData.length,
          success: 0,
          failed: 0,
          inProgress: false,
        })
      } catch (error) {
        console.error("Error parsing file:", error)
        alert("There was an error parsing the file. Please make sure it's a valid Excel or CSV file.")
        setFile(null)
        setPreviewData([])
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleImport = async () => {
    if (!file) return

    setIsImporting(true)
    setImportStatus((prev) => ({ ...prev, inProgress: true }))

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Process imported data
        const importedProducts = jsonData.map((row: any) => {
          // Get brand ID from brand name
          const brandIdFromName = row["Brand Name"] ? getBrandIdByName(row["Brand Name"]) : ""
          // Use the found brand ID or fallback to the logged-in brand ID
          const resolvedBrandId = brandIdFromName || brandId || ""

          return {
            brandId: resolvedBrandId,
            brandid: resolvedBrandId, // Include both brandId and brandid to match the Product interface
            productname: row["Product Name"] || "",
            description: row["Description"] || "",
            price: Number(row["Price"]) || 0,
            quantity: Number(row["Quantity"]) || 0,
            category: row["Category"] || "",
            status: row["Status"] || "Draft",
          }
        })

        // Import each product
        let successCount = 0
        let failedCount = 0

        for (const product of importedProducts) {
          try {
            await dispatch(createProduct(product)).unwrap()
            successCount++
            setImportStatus((prev) => ({ ...prev, success: prev.success + 1 }))
          } catch (error) {
            console.error("Failed to import product:", product, error)
            failedCount++
            setImportStatus((prev) => ({ ...prev, failed: prev.failed + 1 }))
          }
        }

        // Refresh product list
        if (userType === "admin") {
          dispatch(fetchAllProducts())
        } else if (userType === "brand" && brandId) {
          dispatch(fetchBrandProducts(brandId))
        }

        setIsImporting(false)
        setImportStatus((prev) => ({ ...prev, inProgress: false }))
        alert(`Import complete: ${successCount} products imported successfully, ${failedCount} failed.`)
      } catch (error) {
        console.error("Error processing file:", error)
        alert("There was an error processing the file")
        setIsImporting(false)
        setImportStatus((prev) => ({ ...prev, inProgress: false }))
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleDownloadTemplate = () => {
    const workbook = XLSX.utils.book_new()
    const templateData = [
      {
        "Product Name": "Example Product",
        "Brand Name": brandName || "Your Brand Name",
        Description: "Product description goes here",
        Price: 999,
        Quantity: 10,
        Category: "Electronics",
        Status: "Draft",
      },
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateData)
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template")

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = window.URL.createObjectURL(data)
    const link = document.createElement("a")
    link.href = url
    link.download = "product_import_template.xlsx"
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
              {userType === "admin" ? "Import Products" : `Import Products for ${brandName}`}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              <FileText className="h-4 w-4" />
              Download Template
            </button>
          </div>
        </div>

        <div className="rounded-[10px] bg-white px-7.5 py-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Import Products</h2>
            <p className="text-sm text-gray-500 mb-4">
              Upload an Excel (.xlsx) or CSV file with your product data. The file should have columns for Product Name,
              Brand Name, Description, Price, Quantity, Category, and Status.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              {!file ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Drag and drop your file here, or click to select a file</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4" />
                    Select File
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <FileText className="h-12 w-12 text-blue-500" />
                  </div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{importStatus.total} products found in file</p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setFile(null)
                        setPreviewData([])
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                      className="inline-flex items-center gap-2 rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Remove
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={isImporting}
                      className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isImporting ? "Importing..." : "Import Products"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {importStatus.inProgress && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.round(((importStatus.success + importStatus.failed) / importStatus.total) * 100)}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>
                  Progress: {importStatus.success + importStatus.failed} of {importStatus.total}
                </span>
                <span>{Math.round(((importStatus.success + importStatus.failed) / importStatus.total) * 100)}%</span>
              </div>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-green-500">Success: {importStatus.success}</span>
                <span className="text-red-500">Failed: {importStatus.failed}</span>
              </div>
            </div>
          )}

          {previewData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <p className="text-sm text-gray-500 mb-4">Showing the first {previewData.length} rows from your file:</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-stroke dark:border-dark-3">
                      <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">
                        Product Name
                      </th>
                      <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">Brand Name</th>
                      <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">Price</th>
                      <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">Quantity</th>
                      <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">Category</th>
                      <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-b border-stroke dark:border-dark-3">
                        <td className="px-2 py-4 text-left font-medium text-dark dark:text-white">
                          {row["Product Name"]}
                        </td>
                        <td className="px-2 py-4 text-left font-medium text-dark dark:text-white">
                          {row["Brand Name"]}
                        </td>
                        <td className="px-2 py-4 text-left font-medium text-green-light-1">₹{row["Price"]}</td>
                        <td className="px-2 py-4 text-left font-medium text-dark dark:text-white">{row["Quantity"]}</td>
                        <td className="px-2 py-4 text-left font-medium text-dark dark:text-white">{row["Category"]}</td>
                        <td className="px-2 py-4 text-left font-medium text-dark dark:text-white">{row["Status"]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Instructions</h3>
            <div className="space-y-2 text-sm">
              <p>1. Download the template file to see the required format.</p>
              <p>2. Fill in your product data in the template.</p>
              <p>3. Upload the completed file using the form above.</p>
              <p>4. Review the preview to ensure your data looks correct.</p>
              <p>5. Click "Import Products" to begin the import process.</p>
              <p className="text-gray-500 mt-4">
                Note: For brand users, all imported products will be associated with your brand automatically. Admin
                users can specify different brands in the "Brand Name" column.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

