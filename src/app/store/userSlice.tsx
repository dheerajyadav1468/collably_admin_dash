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
  contactNumber: string
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

// New register user thunk that handles FormData
export const registerUser = createAsyncThunk("users/registerUser", async (formData: FormData) => {
  const response = await fetch(API_ROUTES.CREATE_USER, {
    method: "POST",
    body: formData,
    // Don't set Content-Type header when sending FormData
    // The browser will set it automatically with the correct boundary
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || "Failed to register user")
  }

  return await response.json()
})

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
  console.log("API Response:", data)
  return data
})

export const fetchUser = createAsyncThunk("users/fetchUser", async (id: string) => {
  const token = localStorage.getItem("token")
  console.log("Retrieved Token:", token)

  const url = API_ROUTES.GET_USER(id)
  console.log("Fetching user from:", url)

  const response = await fetch(url, {
    headers: {
      Authorization: token,
    },
  })

  console.log("Response Status:", response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to fetch user:", response.status, errorText)
    throw new Error("Failed to fetch user")
  }

  const data = await response.json()
  console.log("Fetched User Data:", data)

  return data.user // 🔹 Only return the `user` object
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
      // Register user cases
      .addCase(registerUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded"
        state.users.push(action.payload)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to register user"
      })
      // Create user cases
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
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded"
        if (Array.isArray(action.payload)) {
          state.users = action.payload
        } else if (action.payload && Array.isArray(action.payload.user)) {
          state.users = action.payload.user
        } else if (action.payload && Array.isArray(action.payload.users)) {
          state.users = action.payload.users
        } else {
          console.error("Unexpected API response structure:", action.payload)
          state.users = []
        }
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
