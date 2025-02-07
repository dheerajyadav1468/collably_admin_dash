import { createAsyncThunk } from "@reduxjs/toolkit"

// Assuming API_ROUTES is defined elsewhere
const API_ROUTES = {
  CREATE_BRAND: "/api/brands",
  UPDATE_BRAND: (id: string) => `/api/brands/${id}`,
}

export interface Brand {
  _id: string
  brandName: string
  brandLogo: string
  brandDescription: string
  brandCategory: string
  contactEmail: string
  brandWebsite: string
  brandPhoneNumber: string
  socialMediaLinks: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
  }
  gstNumber: string
  password: string
}

export const createBrand = createAsyncThunk("brands/createBrand", async (brandData: Omit<Brand, "_id">) => {
  const response = await fetch(API_ROUTES.CREATE_BRAND, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(brandData),
  })
  if (!response.ok) {
    throw new Error("Failed to create brand")
  }
  return await response.json()
})

export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async ({ id, brandData }: { id: string; brandData: Partial<Brand> }) => {
    const response = await fetch(API_ROUTES.UPDATE_BRAND(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(brandData),
    })
    if (!response.ok) {
      throw new Error("Failed to update brand")
    }
    return await response.json()
  },
)

