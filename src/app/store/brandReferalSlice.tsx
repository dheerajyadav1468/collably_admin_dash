import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { API_ROUTES } from "../apiroutes"

export interface BrandReferral {
  _id: string
  userId: {
    _id: string
    fullname: string
    username: string
  }
  referralLink: string
  clicks: number
  createdAt: string
}

interface BrandReferralState {
  referrals: BrandReferral[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: BrandReferralState = {
  referrals: [],
  status: "idle",
  error: null,
}

// Fetch brand referrals for a specific brand (non-admin users)
export const fetchBrandReferrals = createAsyncThunk("brandReferrals/fetchBrandReferrals", async () => {
  const brandId = localStorage.getItem("brandId")
  if (!brandId) {
    throw new Error("Brand ID not found")
  }

  const response = await fetch(API_ROUTES.GET_BRAND_REFERRALS(brandId), {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch brand referrals")
  }

  const data = await response.json()
  console.log("Brand Referrals Response:", data) // Debugging log
  return data
})

// Fetch all brand referrals (admin users)
export const fetchAllBrandReferrals = createAsyncThunk("brandReferrals/fetchAllBrandReferrals", async () => {
  const response = await fetch(API_ROUTES.GET_ALL_REFERRALS, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch all brand referrals")
  }

  const data = await response.json()
  console.log("All Brand Referrals Response:", data) // Debugging log
  return data
})

const brandReferralsSlice = createSlice({
  name: "brandReferrals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrandReferrals.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchBrandReferrals.fulfilled, (state, action: PayloadAction<BrandReferral[]>) => {
        state.status = "succeeded"
        state.referrals = action.payload
      })
      .addCase(fetchBrandReferrals.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch brand referrals"
      })

      .addCase(fetchAllBrandReferrals.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAllBrandReferrals.fulfilled, (state, action: PayloadAction<BrandReferral[]>) => {
        state.status = "succeeded"
        state.referrals = action.payload
      })
      .addCase(fetchAllBrandReferrals.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch all brand referrals"
      })
  },
})

export default brandReferralsSlice.reducer

