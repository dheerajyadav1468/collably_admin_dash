import * as XLSX from "xlsx"
import type { Brand } from "../../app/store/brandSlice"

export const exportToExcel = (brands: Brand[], fileName = "brands-export") => {
 
  const worksheet = XLSX.utils.json_to_sheet(
    brands.map((brand) => ({
      brandName: brand.brandName,
      brandDescription: brand.brandDescription,
      brandCategory: brand.brandCategory,
      contactEmail: brand.contactEmail,
      brandWebsite: brand.brandWebsite,
      brandPhoneNumber: brand.brandPhoneNumber,
      gstNumber: brand.gstNumber,
    })),
  )

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Brands")

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `${fileName}.xlsx`)

}

// Function to export brands to CSV
export const exportToCSV = (brands: Brand[], fileName = "brands-export") => {
  // Create a worksheet from the brands data
  const worksheet = XLSX.utils.json_to_sheet(
    brands.map((brand) => ({
      brandName: brand.brandName,
      brandDescription: brand.brandDescription,
      brandCategory: brand.brandCategory,
      contactEmail: brand.contactEmail,
      brandWebsite: brand.brandWebsite,
      brandPhoneNumber: brand.brandPhoneNumber,
      gstNumber: brand.gstNumber,
    })),
  )

  // Generate CSV content
  const csv = XLSX.utils.sheet_to_csv(worksheet)

  // Create a blob and trigger download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${fileName}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Function to parse Excel/CSV file and return brand data
export const parseImportFile = (file: File): Promise<Partial<Brand>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "binary" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Partial<Brand>[]

        // Validate the imported data has the required fields
        const validatedData = jsonData.filter((item) => item.brandName && item.brandCategory && item.contactEmail)

        resolve(validatedData)
      } catch (error) {
        reject(new Error("Failed to parse file. Please ensure it is a valid Excel or CSV file."))
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file."))
    }

    reader.readAsBinaryString(file)
  })
}