import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { API_ROUTES } from "../apiroutes"

export interface User {
  _id: string
  fullname: string
  username: string
  email: string
  avatar: string
  role: string
  gender: string
  mobile: string
  address: string
  story: string
  website: string
  followers: string[]
  following: string[]
  referralCode: string
  referredBy: string | null
}

interface UsersState {
  users: User[]
  currentUser: User | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  status: "idle",
  error: null,
}

export const createUser = createAsyncThunk("users/createUser", async (userData: Omit<User, "_id">) => {
  const response = await fetch(API_ROUTES.CREATE_USER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
  if (!response.ok) {
    throw new Error("Failed to create user")
  }
  return await response.json()
})

export const fetchAllUsers = createAsyncThunk("users/fetchAllUsers", async () => {
  const response = await fetch(API_ROUTES.GET_ALL_USERS)
  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }
  const data = await response.json()
  return data.users || [] // Assuming the API returns an object with a 'users' array
})

export const fetchUser = createAsyncThunk("users/fetchUser", async (id: string) => {
  const response = await fetch(API_ROUTES.GET_USER(id))
  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }
  return await response.json()
})

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }: { id: string; userData: Partial<User> }) => {
    const response = await fetch(API_ROUTES.UPDATE_USER, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error("Failed to update user")
    }
    return await response.json()
  },
)

export const followUser = createAsyncThunk("users/followUser", async (id: string) => {
  const response = await fetch(API_ROUTES.FOLLOW_USER(id), {
    method: "PATCH",
  })
  if (!response.ok) {
    throw new Error("Failed to follow user")
  }
  return await response.json()
})

export const unfollowUser = createAsyncThunk("users/unfollowUser", async (id: string) => {
  const response = await fetch(API_ROUTES.UNFOLLOW_USER(id), {
    method: "PATCH",
  })
  if (!response.ok) {
    throw new Error("Failed to unfollow user")
  }
  return await response.json()
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded"
        state.users.push(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to create user"
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded"
        state.users = action.payload
        state.error = null
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch users"
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded"
        state.currentUser = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch user"
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded"
        const index = state.users.findIndex((user) => user._id === action.payload._id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
        state.currentUser = action.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to update user"
      })
      .addCase(followUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded"
        const index = state.users.findIndex((user) => user._id === action.payload._id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
        if (state.currentUser && state.currentUser._id === action.payload._id) {
          state.currentUser = action.payload
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded"
        const index = state.users.findIndex((user) => user._id === action.payload._id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
        if (state.currentUser && state.currentUser._id === action.payload._id) {
          state.currentUser = action.payload
        }
      })
  },
})

export default usersSlice.reducer

