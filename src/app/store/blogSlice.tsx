import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { API_ROUTES } from "../apiroutes"

export interface Blog {
  _id: string
  title: string
  content: string
  category: string
  author: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

interface BlogsState {
  blogs: Blog[]
  currentBlog: Blog | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: BlogsState = {
  blogs: [],
  currentBlog: null,
  status: "idle",
  error: null,
}

export const createBlog = createAsyncThunk("blogs/createBlog", async (blogData: FormData) => {
  const response = await fetch(API_ROUTES.UPLOAD_BLOG, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    body: blogData,
  })
  if (!response.ok) {
    throw new Error("Failed to create blog")
  }
  const data = await response.json()
  return data.blog
})

export const fetchAllBlogs = createAsyncThunk("blogs/fetchAllBlogs", async () => {
  const response = await fetch(API_ROUTES.VIEW_BLOGS)
  if (!response.ok) {
    throw new Error("Failed to fetch blogs")
  }
  const data = await response.json()
  return data.blogs
})

export const fetchBlog = createAsyncThunk("blogs/fetchBlog", async (id: string) => {
  const response = await fetch(API_ROUTES.GET_BLOG_BY_ID(id))
  if (!response.ok) {
    throw new Error("Failed to fetch blog")
  }
  const data = await response.json()
  return data.blog
})

export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id: string) => {
  const response = await fetch(API_ROUTES.DELETE_BLOG(id), {
    method: "DELETE",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  })
  if (!response.ok) {
    throw new Error("Failed to delete blog")
  }
  return id
})

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blogData }: { id: string; blogData: FormData }) => {
    const response = await fetch(API_ROUTES.UPDATE_BLOG(id), {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      body: blogData,
    })
    if (!response.ok) {
      throw new Error("Failed to update blog")
    }
    const updatedBlog = await response.json()
    return { id, updatedBlog: updatedBlog.blog }
  },
)

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearBlogs: (state) => {
      state.blogs = []
      state.currentBlog = null
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBlog.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.status = "succeeded"
        state.blogs.push(action.payload)
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to create blog"
      })
      .addCase(fetchAllBlogs.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => {
        state.status = "succeeded"
        state.blogs = action.payload
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch blogs"
      })
      .addCase(fetchBlog.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.status = "succeeded"
        state.currentBlog = action.payload
      })
      .addCase(fetchBlog.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch blog"
      })
      .addCase(deleteBlog.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteBlog.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded"
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload)
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to delete blog"
      })
      .addCase(updateBlog.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateBlog.fulfilled, (state, action: PayloadAction<{ id: string; updatedBlog: Blog }>) => {
        state.status = "succeeded"
        const index = state.blogs.findIndex((blog) => blog._id === action.payload.id)
        if (index !== -1) {
          state.blogs[index] = action.payload.updatedBlog
        }
        state.currentBlog = action.payload.updatedBlog
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to update blog"
      })
  },
})

export const { clearBlogs } = blogsSlice.actions
export default blogsSlice.reducer
