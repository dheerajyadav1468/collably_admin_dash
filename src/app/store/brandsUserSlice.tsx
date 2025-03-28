import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { API_ROUTES } from "../apiroutes"

export interface BrandUser {
  _id: string
  fullname: string
  email: string
  username: string
  role: string
}

interface BrandUsersState {
  users: BrandUser[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: BrandUsersState = {
  users: [],
  status: "idle",
  error: null,
}

export const fetchBrandUsers = createAsyncThunk("brandUsers/fetchBrandUsers", async () => {
  const brandId = localStorage.getItem("brandId")
  if (!brandId) {
    throw new Error("Brand ID not found")
  }

  const response = await fetch(API_ROUTES.GET_USERS_BY_BRAND(brandId), {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch brand users")
  }

  return await response.json()
})

const brandUsersSlice = createSlice({
  name: "brandUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrandUsers.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchBrandUsers.fulfilled, (state, action: PayloadAction<BrandUser[]>) => {
        state.status = "succeeded"
        state.users = action.payload
      })
      .addCase(fetchBrandUsers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch brand users"
      })
      
  },
})

export default brandUsersSlice.reducer

