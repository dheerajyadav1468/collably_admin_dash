import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { API_ROUTES } from "../apiroutes"

export interface UserBrandReferral {
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

interface UserBrandReferralState {
  referrals: UserBrandReferral[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  userId: string | null
}

const initialState: UserBrandReferralState = {
  referrals: [],
  status: "idle",
  error: null,
  userId: null,
}

export const fetchUserBrandReferrals = createAsyncThunk(
  "userBrandReferrals/fetchUserBrandReferrals",
  async (userId: string) => {
    const brandId = localStorage.getItem("brandId")
    if (!brandId) {
      throw new Error("Brand ID not found")
    }

    const response = await fetch(API_ROUTES.GET_USER_BRAND_REFERRALS(userId, brandId), {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user brand referrals")
    }

    return { data: await response.json(), userId }
  },
)


const userBrandReferralsSlice = createSlice({
  name: "userBrandReferrals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBrandReferrals.pending, (state) => {
        state.status = "loading"
      })
      .addCase(
        fetchUserBrandReferrals.fulfilled,
        (state, action: PayloadAction<{ data: UserBrandReferral[]; userId: string }>) => {
          state.status = "succeeded"
          state.referrals = action.payload.data
          state.userId = action.payload.userId
        },
      )
      .addCase(fetchUserBrandReferrals.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch user brand referrals"
      })
  },
})

export default userBrandReferralsSlice.reducer


