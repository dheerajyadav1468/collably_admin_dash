import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { API_ROUTES } from "../apiroutes"

export interface Brand {
  _id: string
  brandName: string
  media?: string
  brandDescription: string
  brandCategory: string
  contactEmail: string
  brandWebsite: string
  brandPhoneNumber: string
  gstNumber: string
  password?: string
}

interface BrandsState {
  brands: Brand[]
  currentBrand: Brand | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: BrandsState = {
  brands: [],
  currentBrand: null,
  status: "idle",
  error: null,
}

export const createBrand = createAsyncThunk("brands/createBrand", async (brandData: FormData, { rejectWithValue }) => {
  try {
    // Log the FormData structure properly
    console.log("Submitting Brand Data:")
    // Safely log FormData keys
    const formDataKeys: string[] = []
    brandData.forEach((value, key) => {
      if (value instanceof File) {
        formDataKeys.push(`${key} (File: ${value.name})`)
      } else {
        formDataKeys.push(key)
      }
    })
    console.log("FormData keys:", formDataKeys)

    const response = await fetch(API_ROUTES.CREATE_BRAND, {
      method: "POST",
      body: brandData, // Don't set Content-Type header with FormData
    })

    if (!response.ok) {
      console.error("Error Response Status:", response.status)
      const errorText = await response.text()
      console.error("Error Response Text:", errorText)
      return rejectWithValue("Failed to create brand")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Request Failed:", error)
    return rejectWithValue(error.message || "Failed to create brand")
  }
})

export const fetchAllBrands = createAsyncThunk("brands/fetchAllBrands", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(API_ROUTES.GET_ALL_BRANDS)
    if (!response.ok) {
      return rejectWithValue("Failed to fetch brands")
    }
    return await response.json()
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch brands")
  }
})

export const fetchBrand = createAsyncThunk("brands/fetchBrand", async (id: string, { rejectWithValue }) => {
  try {
    const response = await fetch(API_ROUTES.GET_BRAND(id))
    if (!response.ok) {
      return rejectWithValue("Failed to fetch brand")
    }
    return await response.json()
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch brand")
  }
})

export const deleteBrand = createAsyncThunk("brands/deleteBrand", async (id: string, { rejectWithValue }) => {
  try {
    const response = await fetch(API_ROUTES.DELETE_BRAND(id), {
      method: "DELETE",
    })
    if (!response.ok) {
      return rejectWithValue("Failed to delete brand")
    }
    return id
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete brand")
  }
})

export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async ({ id, brandData }: { id: string; brandData: FormData }, { rejectWithValue }) => {
    try {
      // Log the FormData structure properly
      console.log("Updating Brand Data:")
      // Safely log FormData keys
      const formDataKeys: string[] = []
      brandData.forEach((value, key) => {
        if (value instanceof File) {
          formDataKeys.push(`${key} (File: ${value.name})`)
        } else {
          formDataKeys.push(key)
        }
      })
      console.log("FormData keys:", formDataKeys)

      const response = await fetch(API_ROUTES.UPDATE_BRAND(id), {
        method: "PUT",
        body: brandData, // Don't set Content-Type header with FormData
      })

      if (!response.ok) {
        console.error("Error Response Status:", response.status)
        const errorText = await response.text()
        console.error("Error Response Text:", errorText)
        return rejectWithValue("Failed to update brand")
      }

      return await response.json()
    } catch (error: any) {
      console.error("Update Request Failed:", error)
      return rejectWithValue(error.message || "Failed to update brand")
    }
  },
)

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBrand.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
        state.status = "succeeded"
        state.brands.push(action.payload)
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.status = "failed"
        state.error = (action.payload as string) || "Failed to create brand"
      })
      .addCase(fetchAllBrands.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAllBrands.fulfilled, (state, action: PayloadAction<Brand[]>) => {
        state.status = "succeeded"
        state.brands = action.payload
      })
      .addCase(fetchAllBrands.rejected, (state, action) => {
        state.status = "failed"
        state.error = (action.payload as string) || "Failed to fetch brands"
      })
      .addCase(fetchBrand.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
        state.status = "succeeded"
        state.currentBrand = action.payload
      })
      .addCase(fetchBrand.rejected, (state, action) => {
        state.status = "failed"
        state.error = (action.payload as string) || "Failed to fetch brand"
      })
      .addCase(deleteBrand.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteBrand.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded"
        state.brands = state.brands.filter((brand) => brand._id !== action.payload)
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.status = "failed"
        state.error = (action.payload as string) || "Failed to delete brand"
      })
      .addCase(updateBrand.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
        state.status = "succeeded"
        const index = state.brands.findIndex((brand) => brand._id === action.payload._id)
        if (index !== -1) {
          state.brands[index] = action.payload
        }
        state.currentBrand = action.payload
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.status = "failed"
        state.error = (action.payload as string) || "Failed to update brand"
      })
  },
})

export default brandsSlice.reducer
