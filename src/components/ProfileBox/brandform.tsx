"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchBrand, updateBrand, createBrand } from "../../app/store/brandSlice"
import type { Brand } from "../../app/store/brandSlice"
import Modal from "./Modal"

const BrandForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const brandId = searchParams.get("id")
  const { currentBrand, status, error } = useSelector((state: RootState) => state.brands)

  const [formData, setFormData] = useState<Partial<Brand>>({
    brandName: "",
    brandDescription: "",
    brandCategory: "",
    contactEmail: "",
    brandWebsite: "",
    brandPhoneNumber: "",
    gstNumber: "",
    password: "",
  })

  const [brandLogo, setBrandLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")

  useEffect(() => {
    if (brandId) {
      dispatch(fetchBrand(brandId))
    }
  }, [dispatch, brandId])

  useEffect(() => {
    if (currentBrand && brandId) {
      setFormData({
        brandName: currentBrand.brandName || "",
        brandDescription: currentBrand.brandDescription || "",
        brandCategory: currentBrand.brandCategory || "",
        contactEmail: currentBrand.contactEmail || "",
        brandWebsite: currentBrand.brandWebsite || "",
        brandPhoneNumber: currentBrand.brandPhoneNumber || "",
        gstNumber: currentBrand.gstNumber || "",
      })

      if (currentBrand.media) {
        setLogoPreview(currentBrand.media)
      }
    }
  }, [currentBrand, brandId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBrandLogo(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Create a new FormData instance
    const formDataToSend = new FormData()

    // Add all text fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formDataToSend.append(key, value.toString())
      }
    })

    // Add brandLogo file if it exists - IMPORTANT: Use "brandLogo" as the key, not "media"
    if (brandLogo) {
      formDataToSend.append("brandLogo", brandLogo)
      console.log("Brand Logo added to FormData:", brandLogo.name, brandLogo.type, brandLogo.size)
    }

    // Log FormData keys
    const formDataKeys: string[] = []
    formDataToSend.forEach((value, key) => {
      if (value instanceof File) {
        formDataKeys.push(`${key} (File: ${value.name})`)
      } else {
        formDataKeys.push(key)
      }
    })
    console.log("FormData keys:", formDataKeys)

    try {
      if (brandId) {
        await dispatch(updateBrand({ id: brandId, brandData: formDataToSend })).unwrap()
        setModalMessage("Brand updated successfully")
      } else {
        await dispatch(createBrand(formDataToSend)).unwrap()
        setModalMessage("Brand created successfully")
      }
      setIsModalOpen(true)
    } catch (error: any) {
      console.error("Form submission error:", error)
      alert(brandId ? "Failed to update brand" : "Failed to create brand")
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    router.push("/brandTable")
  }

  if (status === "loading") return <div>Loading...</div>
  if (status === "failed") return <div>Error: {error}</div>

  return (
    <div className="max-w-6xl p-8 bg-white rounded-lg shadow-lg dark:bg-gray-dark space-y-6">
      <h4 className="text-3xl font-semibold text-dark dark:text-white mb-6">Brand Onboarding Form</h4>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
          {/* Brand Name */}
          <div>
            <label htmlFor="brandName" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Name
            </label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none bg-dark focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your brand name"
              required
            />
          </div>

          {/* Brand Logo */}
          <div>
            <label htmlFor="brandLogo" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Logo
            </label>
            <input
              type="file"
              id="brandLogo"
              name="brandLogo" // Changed from "media" to "brandLogo"
              onChange={handleFileChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              accept="image/*"
            />
            {logoPreview && (
              <div className="mt-2">
                <img
                  src={logoPreview || "/placeholder.svg"}
                  alt="Brand Logo Preview"
                  className="max-w-xs max-h-32 object-contain"
                />
              </div>
            )}
          </div>

          {/* Brand Description */}
          <div className="col-span-2">
            <label htmlFor="brandDescription" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Description
            </label>
            <textarea
              id="brandDescription"
              name="brandDescription"
              value={formData.brandDescription}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your brand"
              required
            />
          </div>

          {/* Brand Category */}
          <div>
            <label htmlFor="brandCategory" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Product Category
            </label>
            <select
              id="brandCategory"
              name="brandCategory"
              value={formData.brandCategory}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="home">Home</option>
              <option value="beauty">Beauty</option>
              <option value="sports">Sports</option>
              <option value="food">Food</option>
            </select>
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Email Id
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter contact email"
              required
            />
          </div>

          {/* Brand Website */}
          <div>
            <label htmlFor="brandWebsite" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Website URL
            </label>
            <input
              type="url"
              id="brandWebsite"
              name="brandWebsite"
              value={formData.brandWebsite}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://www.example.com"
              required
            />
          </div>

          {/* Brand Phone Number */}
          <div>
            <label htmlFor="brandPhoneNumber" className="block text-lg font-medium text-dark dark:text-white mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              id="brandPhoneNumber"
              name="brandPhoneNumber"
              value={formData.brandPhoneNumber}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter phone number"
            />
          </div>

          {/* GST Number */}
          <div>
            <label htmlFor="gstNumber" className="block text-lg font-medium text-dark dark:text-white mb-2">
              GST Number
            </label>
            <input
              type="text"
              id="gstNumber"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter GST number"
            />
          </div>

          {/* Password - only show for new brands */}
          {!brandId && (
            <div>
              <label htmlFor="password" className="block text-lg font-medium text-dark dark:text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter password"
                required={!brandId}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-full md:w-1/3 py-4 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {brandId ? "Update Brand" : "Create Brand"}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <h2 className="text-xl font-bold mb-4">Success!</h2>
        <p>{modalMessage}</p>
      </Modal>
    </div>
  )
}

export default BrandForm
