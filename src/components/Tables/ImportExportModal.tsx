"use client"

import type React from "react"
import { useState } from "react"
import { X, Upload, Download, FileText } from "lucide-react"
import type { Brand } from "../../app/store/brandSlice"
import { exportToExcel, exportToCSV, parseImportFile } from "../../app/utils/FileHandlers"

interface ImportExportModalProps {
  isOpen: boolean
  onClose: () => void
  brands: Brand[]
  onImport: (brands: Partial<Brand>[]) => void
}

const ImportExportModal = ({ isOpen, onClose, brands, onImport }: ImportExportModalProps) => {
  const [activeTab, setActiveTab] = useState<"import" | "export">("export")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!isOpen) return null

  const handleExportToExcel = () => {
    exportToExcel(brands)
    setSuccess("Brands exported to Excel successfully!")
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleExportToCSV = () => {
    exportToCSV(brands)
    setSuccess("Brands exported to CSV successfully!")
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check if file is Excel or CSV
      const fileExt = file.name.split(".").pop()?.toLowerCase()
      if (fileExt === "xlsx" || fileExt === "xls" || fileExt === "csv") {
        setImportFile(file)
        setError(null)
      } else {
        setError("Please select an Excel (.xlsx, .xls) or CSV file.")
        setImportFile(null)
      }
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      setError("Please select a file to import.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const importedBrands = await parseImportFile(importFile)

      if (importedBrands.length === 0) {
        setError("No valid brand data found in the file. Please check the file format.")
      } else {
        onImport(importedBrands)
        setSuccess(`Successfully imported ${importedBrands.length} brands!`)
        setImportFile(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import file.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-dark dark:text-white">Import/Export Brands</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === "export" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("export")}
          >
            Export
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "import" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("import")}
          >
            Import
          </button>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900 dark:text-green-100">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900 dark:text-red-100">{error}</div>
        )}

        {/* Export Tab Content */}
        {activeTab === "export" && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">Export your brands data to Excel or CSV format.</p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleExportToExcel}
                className="flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Export to Excel
              </button>
              <button
                onClick={handleExportToCSV}
                className="flex items-center justify-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                <FileText className="h-4 w-4" />
                Export to CSV
              </button>
            </div>
          </div>
        )}

        {/* Import Tab Content */}
        {activeTab === "import" && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Import brands from Excel or CSV file. The file should contain columns for brandName, brandCategory,
              contactEmail, etc.
            </p>
            <div className="flex flex-col space-y-3">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="mb-2 h-8 w-8 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Excel or CSV files only</p>
                </div>
                <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
              </label>
              {importFile && (
                <div className="rounded-md bg-gray-100 p-2 dark:bg-gray-700">
                  <p className="text-sm">Selected file: {importFile.name}</p>
                </div>
              )}
              <button
                onClick={handleImport}
                disabled={!importFile || isLoading}
                className="flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isLoading ? "Importing..." : "Import Brands"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImportExportModal

