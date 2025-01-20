import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { API_ROUTES } from "../apiroutes"

export interface Product {
  _id: string
  brandId: string
  productname: string
  description: string
  price: number
  quantity: number
  category: string
  status?: "Published" | "Draft"
}

interface ProductsState {
  products: Product[]
  currentProduct: Product | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  status: "idle",
  error: null,
}

export const createProduct = createAsyncThunk("products/createProduct", async (productData: Omit<Product, "_id">) => {
  const response = await fetch(API_ROUTES.CREATE_PRODUCT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })
  if (!response.ok) {
    throw new Error("Failed to create product")
  }
  return await response.json()
})

export const fetchAllProducts = createAsyncThunk("products/fetchAllProducts", async () => {
  const response = await fetch(API_ROUTES.GET_ALL_PRODUCTS)
  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }
  return await response.json()
})

export const fetchProduct = createAsyncThunk("products/fetchProduct", async (id: string) => {
  const response = await fetch(API_ROUTES.GET_PRODUCT(id))
  if (!response.ok) {
    throw new Error("Failed to fetch product")
  }
  return await response.json()
})

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id: string) => {
  const response = await fetch(API_ROUTES.DELETE_PRODUCT(id), {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete product")
  }
  return id
})

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }: { id: string; productData: Partial<Product> }) => {
    const response = await fetch(API_ROUTES.UPDATE_PRODUCT(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
    if (!response.ok) {
      throw new Error("Failed to update product")
    }
    return await response.json()
  },
)

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = "succeeded"
        state.products.push(action.payload)
        state.error = null
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to create product"
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = "succeeded"
        state.products = action.payload
        state.error = null
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch products"
      })
      .addCase(fetchProduct.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = "succeeded"
        state.currentProduct = action.payload
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch product"
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded"
        state.products = state.products.filter((product) => product._id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to delete product"
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = "succeeded"
        const index = state.products.findIndex((product) => product._id === action.payload._id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
        state.currentProduct = action.payload
        state.error = null
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to update product"
      })
  },
})

export default productsSlice.reducer

